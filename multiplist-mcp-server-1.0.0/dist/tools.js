/**
 * Public MCP tool manifest — 19 curated chat-native tools.
 *
 * Canonical list of tools the @multiplist/mcp-server package makes
 * available. Full schemas + handlers live on the hosted server; this
 * manifest is here for directory listings and client-side validation.
 */
import { z } from "zod";

export const PUBLIC_TOOLS = [
  // Capture
  { name: "create_source", category: "capture", summary: "Save a conversation, document, or note to the vault." },
  { name: "update_source", category: "capture", summary: "Append or revise a saved source." },
  { name: "delete_source", category: "capture", summary: "Remove a source and its extracted seeds." },
  // Extraction
  { name: "trigger_extraction", category: "extraction", summary: "Run extraction on a source." },
  { name: "batch_extract", category: "extraction", summary: "Kick off extraction across many sources." },
  { name: "batch_status", category: "extraction", summary: "Poll the status of a batch extraction job." },
  // Custom Skills
  { name: "create_skill", category: "skills", summary: "Define a custom extraction skill for your domain." },
  { name: "list_skills", category: "skills", summary: "List all extraction skills in your vault." },
  { name: "get_skill", category: "skills", summary: "Fetch a single skill definition." },
  { name: "match_skills", category: "skills", summary: "Find which skills apply to a given source." },
  // Discovery
  { name: "get_source", category: "discovery", summary: "Retrieve a source with its seeds and citations." },
  { name: "search_vault", category: "discovery", summary: "Search across the vault for seeds matching a query." },
  { name: "search_sources", category: "discovery", summary: "Browse sources by date, type, or keyword." },
  { name: "get_vault_summary", category: "discovery", summary: "Overview of vault contents, categories, and recency." },
  { name: "get_vault_gaps", category: "discovery", summary: "Surface missing or sparsely extracted areas." },
  // Research
  { name: "request_brief", category: "research", summary: "Synthesize a research brief across the vault." },
  { name: "get_brief_status", category: "research", summary: "Poll a research brief's progress." },
  // Annotate
  { name: "add_annotation", category: "annotate", summary: "Attach an author annotation to a source." },
  { name: "add_marginalia", category: "annotate", summary: "Add a later-mind note: correction, tension, evolution, or commentary." },
];

export const PUBLIC_TOOL_NAMES = PUBLIC_TOOLS.map((t) => t.name);
export const PUBLIC_TOOL_COUNT = PUBLIC_TOOLS.length;

// Zod-checked sanity guard — always 19.
export const publicToolsSchema = z
  .array(z.object({ name: z.string(), category: z.string(), summary: z.string() }))
  .length(19);
publicToolsSchema.parse(PUBLIC_TOOLS);
