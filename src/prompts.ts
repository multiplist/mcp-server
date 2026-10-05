/**
 * Public MCP prompt manifest — 18 curated chat-native prompts.
 *
 * Single source of truth consumed by:
 *  - server/mcp/prompts/mcp-prompts.ts (live registration with typed arguments)
 *  - server/mcp/package-public/src/server-card.ts (directory metadata)
 *  - .well-known/mcp/server-card.json (Smithery, Glama, and client discovery)
 *
 * Keep this file static data only — no runtime dependencies on the MCP SDK
 * so the @multiplist/mcp-server npm package can import it cleanly.
 */

import { z } from "zod";

export type PromptCategory =
  | "core-flow"
  | "extraction"
  | "research"
  | "workspace"
  | "annotate"
  | "local_silicon";

export interface PromptArgumentDef {
  name: string;
  description: string;
  required?: boolean;
}

export interface PublicPrompt {
  name: string;
  category: PromptCategory;
  description: string;
  arguments?: readonly PromptArgumentDef[];
  /** Canonical user-facing phrasing the MCP host injects when the prompt is picked. */
  userText: string;
}

export const PUBLIC_PROMPTS: readonly PublicPrompt[] = [
  // ── Core Flow ──
  {
    name: "save-conversation",
    category: "core-flow",
    description:
      "Save this conversation to your vault. Multiplist extracts decisions, frameworks, and insights automatically — with full provenance.",
    userText: "Save this conversation to my vault.",
  },
  {
    name: "show-seed-doc",
    category: "core-flow",
    description:
      "Pull a Seed Doc — your thinking organized into decisions, frameworks, golden passages, and more. The shareable artifact.",
    userText: "Show me my Seed Doc.",
  },

  // ── 8 Canonical Extraction Categories ──
  {
    name: "show-decisions",
    category: "extraction",
    description:
      "Search your vault for decisions on a specific topic — pulled from all past conversations with exact citations.",
    arguments: [
      {
        name: "topic",
        description: "Topic or question to search decisions for (optional)",
        required: false,
      },
    ],
    userText: "What have I decided about [topic]?",
  },
  {
    name: "show-frameworks",
    category: "extraction",
    description:
      "Surface the mental models and structured approaches you've developed across all conversations.",
    arguments: [
      {
        name: "topic",
        description: "Topic or mental model to search frameworks for (optional)",
        required: false,
      },
    ],
    userText: "What frameworks have I developed about [topic]?",
  },
  {
    name: "show-golden-passages",
    category: "extraction",
    description:
      "Find your best insights — phrases and ideas worth keeping exactly as you said them.",
    arguments: [
      {
        name: "topic",
        description: "Topic or phrase to surface memorable insights for (optional)",
        required: false,
      },
    ],
    userText: "Show me my best insights and golden passages about [topic].",
  },
  {
    name: "show-definitions",
    category: "extraction",
    description:
      "Find terms, concepts, and ideas you've defined or coined across your conversations.",
    arguments: [
      {
        name: "term",
        description: "Term, concept, or phrase defined in past conversations (optional)",
        required: false,
      },
    ],
    userText: "What terms and concepts have I defined around [term]?",
  },
  {
    name: "show-actions",
    category: "extraction",
    description:
      "Find open action items, tasks, and commitments across all your saved conversations.",
    arguments: [
      {
        name: "topic",
        description: "Project, client, or topic to find open action items for (optional)",
        required: false,
      },
    ],
    userText: "What are my open action items regarding [topic]?",
  },
  {
    name: "show-questions",
    category: "extraction",
    description:
      "Surface unresolved questions and open loops from across your vault.",
    arguments: [
      {
        name: "topic",
        description: "Topic to surface open loops and unresolved questions for (optional)",
        required: false,
      },
    ],
    userText: "What questions are still open regarding [topic]?",
  },
  {
    name: "show-offers",
    category: "extraction",
    description:
      "Find opportunities, proposed next steps, and invitations from your conversations.",
    arguments: [
      {
        name: "topic",
        description: "Topic or client domain to discover waiting action offers for (optional)",
        required: false,
      },
    ],
    userText: "What opportunities and offers are waiting regarding [topic]?",
  },
  {
    name: "show-emergence",
    category: "extraction",
    description:
      "Discover patterns forming across your conversations — connections you might not have noticed.",
    arguments: [
      {
        name: "topic",
        description: "Topic or domain to discover nascent patterns for (optional)",
        required: false,
      },
    ],
    userText: "What patterns are forming across my thinking regarding [topic]?",
  },

  // ── Research & Discovery ──
  {
    name: "research-topic",
    category: "research",
    description:
      "Synthesize across your entire vault on any topic. Produces a citable research document tracing how your thinking has evolved.",
    arguments: [
      {
        name: "topic",
        description: "Topic to synthesize a citable research document for",
        required: true,
      },
    ],
    userText: "Research how my thinking has evolved about [topic].",
  },
  {
    name: "browse-recent",
    category: "research",
    description: "Browse everything saved in the last week — by date, type, or keyword.",
    arguments: [
      {
        name: "timeframe",
        description: "Timeframe to browse (e.g. 'last week', 'last 24 hours')",
        required: false,
      },
    ],
    userText: "Show me everything from [timeframe].",
  },
  {
    name: "vault-summary",
    category: "research",
    description:
      "Get a complete overview of your vault — how many sources, what categories are covered, recent activity, and what's missing.",
    userText: "What's in my vault?",
  },

  // ── Continuous Workspaces ──
  {
    name: "compose-workspace",
    category: "workspace",
    description:
      "Talk a continuous workspace into being — creates Container, Studios, and Lanes for a project domain or client goal.",
    arguments: [
      {
        name: "goal",
        description: "The project goal, client retainer, or domain to structure",
        required: true,
      },
    ],
    userText: "Compose a continuous workspace with container, studios, and lanes for [goal].",
  },
  {
    name: "desk-orientation",
    category: "workspace",
    description:
      "Inspect desk state, resident agent, equipped tool bouquet, active cards, and pinned sources for a studio desk.",
    arguments: [
      {
        name: "studio",
        description: "Name or ID of the studio desk to inspect",
        required: true,
      },
    ],
    userText: "Orient to the desk for [studio]: check resident agent, equipped tool bouquet, active cards, and pinned sources.",
  },
  {
    name: "scaffold-runway",
    category: "workspace",
    description:
      "Scaffold the canonical 5-Lane Agent Runway (Intake, Doing, Needs Context, Review, Shipped & Vaulted) for a studio deck.",
    arguments: [
      {
        name: "studio",
        description: "Name or ID of the studio to scaffold the 5-lane agent runway for",
        required: true,
      },
    ],
    userText: "Scaffold the canonical 5-lane agent runway (Intake, Doing, Needs Context, Review, Shipped & Vaulted) for [studio].",
  },

  // ── Living Marginalia ──
  {
    name: "add-marginalia",
    category: "annotate",
    description:
      "Attach a correction, tension flag, evolution narrative, or commentary by a later mind to a vault source with scribe provenance.",
    arguments: [
      {
        name: "source",
        description: "Title or ID of the source to annotate",
        required: true,
      },
      {
        name: "note",
        description: "The commentary, tension flag, or insight to attach",
        required: true,
      },
    ],
    userText: "Add marginalia to [source]: [note].",
  },

  // ── Sovereign Local Silicon ──
  {
    name: "query-local-model",
    category: "local_silicon",
    description:
      "Execute private local inference directly on host Apple Silicon or local GPU via Ollama at $0.00 compute cost.",
    arguments: [
      {
        name: "prompt",
        description: "The prompt or instruction to execute locally",
        required: true,
      },
      {
        name: "model",
        description: "Local model name (optional, e.g. 'llama3.2', 'deepseek-r1')",
        required: false,
      },
    ],
    userText: "Query local model [model] with: [prompt].",
  },
] as const;

export const PUBLIC_PROMPT_NAMES = PUBLIC_PROMPTS.map((p) => p.name);
export const PUBLIC_PROMPT_COUNT = PUBLIC_PROMPTS.length;

// Zod-checked sanity guard — exactly 18 prompts.
export const publicPromptsSchema = z
  .array(
    z.object({
      name: z.string(),
      category: z.string(),
      description: z.string(),
      arguments: z
        .array(
          z.object({
            name: z.string(),
            description: z.string(),
            required: z.boolean().optional(),
          }),
        )
        .optional(),
      userText: z.string(),
    }),
  )
  .length(18);
publicPromptsSchema.parse(PUBLIC_PROMPTS);
