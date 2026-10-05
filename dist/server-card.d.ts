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
export interface ServerCardInput {
    /** Base URL the card is served from, e.g. "https://multiplist.ai". */
    baseUrl: string;
    name: string;
    title: string;
    version: string;
    description: string;
    websiteUrl: string;
    instructions: string;
    iconUrl: string;
}
export interface ServerCard {
    $schema: string;
    name: string;
    title: string;
    version: string;
    description: string;
    websiteUrl: string;
    documentationUrl: string;
    icons: Array<{
        src: string;
        mimeType: string;
        sizes: string[];
    }>;
    transport: {
        type: "streamable-http";
        url: string;
    };
    authentication: {
        type: "oauth2";
        authorizationServer: string;
        protectedResourceMetadata: string;
        scopes: string[];
    };
    capabilities: {
        toolCount: number;
        promptCount: number;
        resourceCount: number;
    };
    tools: Array<{
        name: string;
        category: string;
        description: string;
    }>;
    prompts: Array<{
        name: string;
        category: string;
        description: string;
        arguments?: Array<{
            name: string;
            description: string;
            required?: boolean;
        }>;
    }>;
    resources: Array<{
        uriTemplate: string;
        name: string;
        description: string;
    }>;
    instructions: string;
    metadata: {
        protocolVersion: string;
        generatedAt: string;
        source: string;
    };
}
export declare function buildServerCard(input: ServerCardInput): ServerCard;
