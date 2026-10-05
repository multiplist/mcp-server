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
import "dotenv/config";
