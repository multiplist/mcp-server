#!/usr/bin/env node
/**
 * @multiplist/mcp-server — public cloud proxy entry point
 *
 * Bridges stdio (from Claude Desktop, Claude Code, or any MCP host) to the
 * hosted Multiplist MCP endpoint at https://multiplist.ai/mcp.
 *
 * Authenticates with an MCP Token (mcp_live_… or, for tokens issued
 * before May 2026, 64-char hex), sent as the `x-mcp-key` header. All
 * tool calls, schemas, and responses flow transparently — this package
 * embeds no business logic. The 19 curated tools are defined on the server.
 *
 * Heads up: MCP Tokens (Settings → MCP Tokens, prefix `mcp_live_`) are
 * the only token type this bridge accepts. REST API Keys (Settings →
 * API Keys, prefix `mp_live_`) only work on /api/v1/* and will 401 here.
 *
 * Env vars:
 *   MULTIPLIST_MCP_TOKEN — preferred; your MCP Token from multiplist.ai settings
 *   MULTIPLIST_MCP_URL   — optional override (default: https://multiplist.ai/mcp)
 *
 * Legacy aliases (still accepted for compatibility):
 *   MULTIPLIST_API_KEY   → MULTIPLIST_MCP_TOKEN  (historical name; the value
 *                          is and has always been an MCP Token, not a REST
 *                          API Key — kept to avoid breaking existing configs)
 *   MCP_KEY              → MULTIPLIST_MCP_TOKEN
 *   MCP_URL              → MULTIPLIST_MCP_URL
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import "dotenv/config";
const mcpToken = process.env.MULTIPLIST_MCP_TOKEN ||
    process.env.MULTIPLIST_API_KEY ||
    process.env.MCP_KEY;
const mcpUrl = process.env.MULTIPLIST_MCP_URL ||
    process.env.MCP_URL ||
    "https://multiplist.ai/mcp";
if (!mcpToken) {
    process.stderr.write([
        "",
        "╔══════════════════════════════════════════════════════════════╗",
        "║  Multiplist MCP Server                                       ║",
        "╠══════════════════════════════════════════════════════════════╣",
        "║                                                              ║",
        "║  No MCP token found.                                         ║",
        "║                                                              ║",
        "║  Get a token:                                                ║",
        "║  https://multiplist.ai → Settings → MCP Tokens               ║",
        "║                                                              ║",
        "║  (Note: REST API Keys from Settings → API Keys are a         ║",
        "║   different system and do not work here.)                    ║",
        "║                                                              ║",
        "║  Then add to your MCP host config:                           ║",
        "║    \"env\": { \"MULTIPLIST_MCP_TOKEN\": \"mcp_live_...\" }         ║",
        "║                                                              ║",
        "╚══════════════════════════════════════════════════════════════╝",
        "",
    ].join("\n"));
    process.exit(1);
}
// Soft warning if the user pasted a REST API Key by mistake. The /mcp
// endpoint will 401 it, but we can flag the likely cause up front.
if (mcpToken.startsWith("mp_live_")) {
    process.stderr.write("[multiplist-mcp] WARNING: token starts with mp_live_ — that's a REST API Key, not an MCP Token. " +
        "Generate an MCP Token in Settings → MCP Tokens (mcp_live_…) and use that instead.\n");
}
async function main() {
    process.stderr.write(`[multiplist-mcp] connecting to ${mcpUrl}\n`);
    const remote = new StreamableHTTPClientTransport(new URL(mcpUrl), {
        requestInit: {
            headers: { "x-mcp-key": mcpToken },
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
        remote.close().catch(() => { });
        process.exit(0);
    };
    try {
        await remote.start();
        await stdio.start();
        process.stderr.write("[multiplist-mcp] ready\n");
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
            const tokenHint = mcpToken.startsWith("mp_live_")
                ? " (you appear to be using a REST API Key — generate an MCP Token at Settings → MCP Tokens instead)"
                : " (verify your MCP Token in Settings → MCP Tokens; new tokens use the mcp_live_ prefix)";
            process.stderr.write(`[multiplist-mcp] authentication failed${tokenHint}\n`);
        }
        else {
            process.stderr.write(`[multiplist-mcp] failed to connect: ${msg}\n`);
        }
        process.exit(1);
    }
    const shutdown = async () => {
        await remote.close().catch(() => { });
        process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
}
main().catch((err) => {
    process.stderr.write(`[multiplist-mcp] fatal: ${String(err)}\n`);
    process.exit(1);
});
