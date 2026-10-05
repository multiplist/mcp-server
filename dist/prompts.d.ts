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
export type PromptCategory = "core-flow" | "extraction" | "research";
export interface PublicPrompt {
    name: string;
    category: PromptCategory;
    description: string;
    /** Canonical user-facing phrasing the MCP host injects when the prompt is picked. */
    userText: string;
}
export declare const PUBLIC_PROMPTS: readonly PublicPrompt[];
export declare const PUBLIC_PROMPT_NAMES: string[];
export declare const PUBLIC_PROMPT_COUNT: number;
export declare const publicPromptsSchema: z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    userText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    category: string;
    description: string;
    userText: string;
}, {
    name: string;
    category: string;
    description: string;
    userText: string;
}>, "many">;
