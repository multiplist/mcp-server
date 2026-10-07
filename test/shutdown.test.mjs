import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createShutdown } from '../dist/shutdown.js';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const never = () => new Promise(() => {});

test('shutdown is reentrant, terminates once before close, and drains initialization', async () => {
  const events = [];
  let shutdown;
  shutdown = createShutdown({
    drain: async () => { await delay(10); events.push('drain'); },
    remote: {
      terminateSession: async () => { events.push('terminate'); await delay(10); },
      close: async () => { events.push('remote-close'); void shutdown(); },
    },
    stdio: { close: async () => { events.push('stdio-close'); void shutdown(); } },
    log: message => events.push(message), exit: code => events.push(`exit-${code}`),
  });
  const first = shutdown();
  assert.equal(shutdown(), first);
  await first;
  assert.deepEqual(events, ['drain', 'terminate', 'remote-close', 'stdio-close', 'exit-0']);
});

for (const failure of ['delete-reject', 'delete-hang', 'close-reject', 'close-hang', 'drain-hang']) {
  test(`${failure} still exits within the shutdown bound`, async () => {
    const events = [];
    const shutdown = createShutdown({
      drain: failure === 'drain-hang' ? never : async () => {},
      remote: {
        terminateSession: async () => {
          events.push('terminate');
          if (failure === 'delete-reject') throw new Error('secret-token');
          if (failure === 'delete-hang') await never();
        },
        close: async () => {
          events.push('close');
          if (failure === 'close-reject') throw new Error('secret-token');
          if (failure === 'close-hang') await never();
        },
      },
      stdio: { close: async () => {} },
      exit: code => events.push(`exit-${code}`), log: message => events.push(message),
      terminationTimeoutMs: 20, closeTimeoutMs: 20,
    });
    const start = Date.now();
    await shutdown(1);
    assert.ok(Date.now() - start < 500);
    assert.equal(events.at(-1), 'exit-1');
    assert.ok(events.includes('close'));
    assert.equal(events.filter(e => e === 'terminate').length, failure === 'drain-hang' ? 0 : 1);
    assert.match(events.join(' '), /failed or timed out/);
    assert.doesNotMatch(events.join(' '), /secret-token/);
  });
}

test('a drain that finishes after the deadline cannot start a late DELETE', async () => {
  let resolveDrain;
  let terminations = 0;
  const shutdown = createShutdown({
    drain: () => new Promise(resolve => { resolveDrain = resolve; }),
    remote: { terminateSession: async () => { terminations++; }, close: async () => {} },
    stdio: { close: async () => {} }, log: () => {}, exit: () => {}, terminationTimeoutMs: 10,
  });
  await shutdown(); resolveDrain(); await delay(5);
  assert.equal(terminations, 0);
});

async function fixture(t, deleteMode = 'ok') {
  let live = false, deletes = 0, initSeen;
  const initialized = new Promise(resolve => { initSeen = resolve; });
  const server = createServer(async (req, res) => {
    assert.equal(req.headers['x-mcp-key'], 'fixture-only');
    if (req.method === 'POST') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString());
      if (live) { res.writeHead(429); res.end('SESSION_LIMIT'); return; }
      live = true;
      initSeen();
      await delay(40); // EOF may arrive while initialization is in flight.
      res.writeHead(200, { 'Content-Type': 'application/json', 'mcp-session-id': 'fixture-session' });
      res.end(JSON.stringify({ jsonrpc: '2.0', id: body.id, result: {
        protocolVersion: '2025-03-26', capabilities: {}, serverInfo: { name: 'local-capacity-fixture', version: '1' },
      } }));
    } else if (req.method === 'DELETE') {
      deletes++;
      assert.equal(req.headers['mcp-session-id'], 'fixture-session');
      if (deleteMode === 'hang') return;
      await delay(70); // Prove the process awaits DELETE, not merely dispatches it.
      if (deleteMode === 'ok') live = false;
      res.writeHead(deleteMode === 'error' ? 500 : deleteMode === 'unsupported' ? 405 : 204);
      res.end();
    } else { res.writeHead(405); res.end(); }
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); });
  const url = `http://127.0.0.1:${server.address().port}/mcp`;
  function launch() {
    const child = spawn(process.execPath, [process.env.TEST_BRIDGE_ENTRY || 'dist/index.js'], {
      cwd: new URL('..', import.meta.url), stdio: ['pipe', 'pipe', 'pipe'],
      env: { PATH: process.env.PATH, MULTIPLIST_MCP_TOKEN: 'fixture-only', MULTIPLIST_MCP_URL: url, DOTENV_CONFIG_PATH: '/dev/null' },
    });
    let output = '', errors = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { errors += chunk; });
    const exited = once(child, 'exit');
    t.after(() => { if (child.exitCode === null) child.kill('SIGKILL'); });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {
      protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'local-test', version: '1' },
    } }) + '\n');
    return { child, exited, output: () => output, errors: () => errors };
  }
  return { launch, initialized, live: () => live, deletes: () => deletes };
}
async function until(predicate) {
  const deadline = Date.now() + 3000;
  while (!predicate()) { assert.ok(Date.now() < deadline, 'fixture ready before deadline'); await delay(5); }
}

for (const trigger of ['EOF', 'SIGINT', 'SIGTERM', 'overlap', 'EOF-during-initialize']) {
  test(`CLI ${trigger} sends exactly one authenticated DELETE and releases fixture capacity`, { timeout: 8000 }, async t => {
    const f = await fixture(t);
    const run = f.launch();
    if (trigger === 'EOF-during-initialize') await f.initialized;
    else await until(() => run.output().includes('local-capacity-fixture'));
    if (trigger.startsWith('EOF')) run.child.stdin.end();
    else if (trigger === 'overlap') {
      run.child.kill('SIGINT'); run.child.stdin.end();
      await delay(15); run.child.kill('SIGTERM');
    } else run.child.kill(trigger);
    assert.deepEqual(await run.exited, [0, null]);
    assert.equal(f.deletes(), 1); assert.equal(f.live(), false);
    const next = f.launch();
    await until(() => next.output().includes('local-capacity-fixture'));
    next.child.stdin.end();
    assert.deepEqual(await next.exited, [0, null]);
    assert.equal(f.deletes(), 2); assert.equal(f.live(), false);
  });
}
for (const mode of ['error', 'hang', 'unsupported']) {
  test(`CLI DELETE ${mode} exits safely without claiming capacity was released`, { timeout: 8000 }, async t => {
    const f = await fixture(t, mode), run = f.launch();
    await until(() => run.output().includes('local-capacity-fixture'));
    run.child.stdin.end();
    assert.deepEqual(await run.exited, [0, null]);
    assert.equal(f.deletes(), 1); assert.equal(f.live(), true);
    if (mode !== 'unsupported') assert.match(run.errors(), /termination failed or timed out/);
  });
}
