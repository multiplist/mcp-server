/** One shutdown for EOF, signals and transport closure, including reentrant callbacks. */
export function createShutdown({ remote, stdio, drain, log, exit, terminationTimeoutMs = 3_000, closeTimeoutMs = 1_000, }) {
    let shutdown;
    async function bounded(work, timeoutMs, phase) {
        let timer;
        try {
            await Promise.race([
                work,
                new Promise((_, reject) => {
                    timer = setTimeout(() => reject(new Error('deadline')), timeoutMs);
                }),
            ]);
        }
        catch {
            // Error bodies may contain endpoint URLs or credentials. Do not echo them.
            log(`[multiplist-mcp] shutdown ${phase} failed or timed out; closing locally\n`);
        }
        finally {
            clearTimeout(timer);
        }
    }
    return (exitCode = 0) => {
        if (shutdown)
            return shutdown;
        // Defer execution so onclose callbacks always see the same promise.
        shutdown = Promise.resolve().then(async () => {
            let terminationExpired = false;
            await bounded((async () => {
                // An initialize already sent over stdin may still be returning its ID.
                await drain();
                if (!terminationExpired)
                    await remote.terminateSession();
            })(), terminationTimeoutMs, 'termination');
            terminationExpired = true;
            // close() aborts an outstanding DELETE on timeout. Bound local close too.
            await bounded(Promise.all([
                Promise.resolve().then(() => remote.close()),
                Promise.resolve().then(() => stdio.close()),
            ]), closeTimeoutMs, 'transport close');
            exit(exitCode);
        });
        return shutdown;
    };
}
