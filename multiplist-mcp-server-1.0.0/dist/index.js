#!/usr/bin/env node
/**
 * @multiplist/mcp-server — public cloud proxy entry point
 *
 * Bridges stdio (from Claude Desktop, Claude Code, or any MCP host) to the
 * hosted Multiplist MCP endpoint at https://multiplist.ai/mcp.
 *
 * The user's API key is sent as the `x-mcp-key` header. All tool calls,
 * schemas, and responses flow transparently — this package embeds no
 * business logic. The 19 curated tools are defined on the server.
 *
 * Env vars:
 *   MULTIPLIST_API_KEY   — required; your API key from multiplist.ai settings
 *   MULTIPLIST_MCP_URL   — optional override (default: https://multiplist.ai/mcp)
 *
 * Legacy aliases (still accepted for compatibility):
 *   MCP_KEY              → MULTIPLIST_API_KEY
 *   MCP_URL              → MULTIPLIST_MCP_URL
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import "dotenv/config";

const apiKey = process.env.MULTIPLIST_API_KEY || process.env.MCP_KEY;
const mcpUrl =
  process.env.MULTIPLIST_MCP_URL ||
  process.env.MCP_URL ||
  "https://multiplist.ai/mcp";

if (!apiKey) {
  process.stderr.write(
    [
      "",
      "╔══════════════════════════════════════════════════════════════╗",
      "║  Multiplist MCP Server                                       ║",
      "╠══════════════════════════════════════════════════════════════╣",
      "║                                                              ║",
      "║  MULTIPLIST_API_KEY is not set.                              ║",
      "║                                                              ║",
      "║  Get your key:                                               ║",
      "║  https://multiplist.ai → Settings → API Keys                 ║",
      "║                                                              ║",
      "║  Then add to your MCP host config:                           ║",
      "║    \"env\": { \"MULTIPLIST_API_KEY\": \"your-key\" }               ║",
      "║                                                              ║",
      "╚══════════════════════════════════════════════════════════════╝",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

async function main() {
  process.stderr.write(`[multiplist-mcp] connecting to ${mcpUrl}\n`);

  const remote = new StreamableHTTPClientTransport(new URL(mcpUrl), {
    requestInit: {
      headers: { "x-mcp-key": apiKey },
    },
  });

  const stdio = new StdioServerTransport();

  remote.onmessage = (message) => {
    stdio.send(message).catch((err) => {
      process.stderr.write(`[multiplist-mcp] stdio send error: ${String(err)}\n`);
    });
  };
  remote.onerror = (err) => {
    process.stderr.write(`[multiplist-mcp] remote error: ${String(err)}\n`);
  };
  remote.onclose = () => {
    process.stderr.write("[multiplist-mcp] remote closed\n");
    process.exit(0);
  };

  stdio.onmessage = (message) => {
    remote.send(message).catch((err) => {
      process.stderr.write(`[multiplist-mcp] remote send error: ${String(err)}\n`);
    });
  };
  stdio.onerror = (err) => {
    process.stderr.write(`[multiplist-mcp] stdio error: ${String(err)}\n`);
  };
  stdio.onclose = () => {
    remote.close().catch(() => {});
    process.exit(0);
  };

  try {
    await remote.start();
    await stdio.start();
    process.stderr.write("[multiplist-mcp] ready\n");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
      process.stderr.write(
        "[multiplist-mcp] authentication failed — check MULTIPLIST_API_KEY\n",
      );
    } else {
      process.stderr.write(`[multiplist-mcp] failed to connect: ${msg}\n`);
    }
    process.exit(1);
  }

  const shutdown = async () => {
    await remote.close().catch(() => {});
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  process.stderr.write(`[multiplist-mcp] fatal: ${String(err)}\n`);
  process.exit(1);
});
