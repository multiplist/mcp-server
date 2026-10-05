/**
 * Public MCP prompt manifest — 13 curated chat-native prompts.
 *
 * Single source of truth consumed by:
 *  - server/mcp/prompts/mcp-prompts.ts (live registration)
 *  - server/mcp/package-public/src/server-card.ts (directory metadata)
 *
 * Keep this file static data only — no runtime dependencies on the MCP SDK
 * so the @multiplist/mcp-server npm package can import it cleanly.
 */
import { z } from "zod";
export const PUBLIC_PROMPTS = [
    // Core flow
    {
        name: "save-conversation",
        category: "core-flow",
        description: "Save this conversation to your vault. Multiplist extracts decisions, frameworks, and insights automatically — with full provenance.",
        userText: "Save this conversation to my vault.",
    },
    {
        name: "show-seed-doc",
        category: "core-flow",
        description: "Pull a Seed Doc — your thinking organized into decisions, frameworks, golden passages, and more. The shareable artifact.",
        userText: "Show me my Seed Doc.",
    },
    // 8 extraction categories
    {
        name: "show-decisions",
        category: "extraction",
        description: "Search your vault for decisions on a specific topic — pulled from all past conversations with exact citations.",
        userText: "What have I decided about [topic]?",
    },
    {
        name: "show-frameworks",
        category: "extraction",
        description: "Surface the mental models and structured approaches you've developed across all conversations.",
        userText: "What frameworks have I developed?",
    },
    {
        name: "show-golden-passages",
        category: "extraction",
        description: "Find your best insights — phrases and ideas worth keeping exactly as you said them.",
        userText: "Show me my best insights and golden passages.",
    },
    {
        name: "show-definitions",
        category: "extraction",
        description: "Find terms, concepts, and ideas you've defined or coined across your conversations.",
        userText: "What terms have I defined?",
    },
    {
        name: "show-actions",
        category: "extraction",
        description: "Find open action items, tasks, and commitments across all your saved conversations.",
        userText: "What are my open action items?",
    },
    {
        name: "show-questions",
        category: "extraction",
        description: "Surface unresolved questions and open loops from across your vault.",
        userText: "What questions are still open?",
    },
    {
        name: "show-offers",
        category: "extraction",
        description: "Find opportunities, proposed next steps, and invitations from your conversations.",
        userText: "What opportunities are waiting?",
    },
    {
        name: "show-emergence",
        category: "extraction",
        description: "Discover patterns forming across your conversations — connections you might not have noticed.",
        userText: "What patterns are forming across my thinking?",
    },
    // Research & discovery
    {
        name: "research-topic",
        category: "research",
        description: "Synthesize across your entire vault on any topic. Produces a citable research document tracing how your thinking has evolved.",
        userText: "Research how my thinking has evolved about [topic].",
    },
    {
        name: "browse-recent",
        category: "research",
        description: "Browse everything saved in the last week — by date, type, or keyword.",
        userText: "Show me everything from last week.",
    },
    {
        name: "vault-summary",
        category: "research",
        description: "Get a complete overview of your vault — how many sources, what categories are covered, recent activity, and what's missing.",
        userText: "What's in my vault?",
    },
];
export const PUBLIC_PROMPT_NAMES = PUBLIC_PROMPTS.map((p) => p.name);
export const PUBLIC_PROMPT_COUNT = PUBLIC_PROMPTS.length;
// Zod-checked sanity guard — always 13.
export const publicPromptsSchema = z
    .array(z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    userText: z.string(),
}))
    .length(13);
publicPromptsSchema.parse(PUBLIC_PROMPTS);
