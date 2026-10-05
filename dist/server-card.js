/**
 * server-card.json builder
 *
 * Produces the payload served at:
 *   https://multiplist.ai/.well-known/mcp/server-card.json
 *
 * Built at request time from the same manifests the live MCP server uses
 * (PUBLIC_TOOLS, PUBLIC_PROMPTS, SERVER_* constants). The card can never
 * drift from what the server actually exposes.
 *
 * Registry consumers (Smithery, OpenAI, Anthropic, generic MCP directories)
 * read this instead of scanning the OAuth-protected /mcp endpoint. Minimum
 * fields per Smithery: name, description, transport, tools[]. Everything
 * else is defensive enrichment.
 */
import { PUBLIC_TOOLS } from "./tools";
import { PUBLIC_PROMPTS } from "./prompts";
const RESOURCES = [
    {
        uriTemplate: "multiplist://capsule/{userId}",
        name: "Vault Capsule",
        description: "Read-only context snapshot of the user's vault — recent sources, top categories, and activity signals.",
    },
    {
        uriTemplate: "multiplist://seeds/{tag}",
        name: "Seeds by Tag",
        description: "All extracted seeds (decisions, frameworks, passages, etc.) filtered by a given tag.",
    },
];
export function buildServerCard(input) {
    const { baseUrl, name, title, version, description, websiteUrl, instructions, iconUrl, } = input;
    return {
        $schema: "https://smithery.ai/schema/server-card.json",
        name,
        title,
        version,
        description,
        websiteUrl,
        documentationUrl: `${websiteUrl}/docs/mcp`,
        icons: [
            {
                src: iconUrl,
                mimeType: "image/svg+xml",
                sizes: ["any"],
            },
        ],
        transport: {
            type: "streamable-http",
            url: `${baseUrl}/mcp`,
        },
        authentication: {
            type: "oauth2",
            authorizationServer: baseUrl,
            protectedResourceMetadata: `${baseUrl}/.well-known/oauth-protected-resource`,
            scopes: ["mcp:read", "mcp:write", "mcp:tools"],
        },
        capabilities: {
            toolCount: PUBLIC_TOOLS.length,
            promptCount: PUBLIC_PROMPTS.length,
            resourceCount: RESOURCES.length,
        },
        tools: PUBLIC_TOOLS.map((t) => ({
            name: t.name,
            category: t.category,
            description: t.summary,
        })),
        prompts: PUBLIC_PROMPTS.map((p) => ({
            name: p.name,
            category: p.category,
            description: p.description,
            ...(p.arguments ? { arguments: [...p.arguments] } : {}),
        })),
        resources: RESOURCES,
        instructions,
        metadata: {
            protocolVersion: "2025-06-18",
            generatedAt: new Date().toISOString(),
            source: "server/mcp/package-public/src/server-card.ts",
        },
    };
}
