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
export type PromptCategory = "core-flow" | "extraction" | "research" | "workspace" | "annotate" | "local_silicon";
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
export declare const PUBLIC_PROMPTS: readonly PublicPrompt[];
export declare const PUBLIC_PROMPT_NAMES: string[];
export declare const PUBLIC_PROMPT_COUNT: number;
export declare const publicPromptsSchema: z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    category: z.ZodString;
    description: z.ZodString;
    arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        required: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        required?: boolean | undefined;
    }, {
        name: string;
        description: string;
        required?: boolean | undefined;
    }>, "many">>;
    userText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    category: string;
    description: string;
    arguments?: {
        name: string;
        description: string;
        required?: boolean | undefined;
    }[] | undefined;
    userText: string;
}, {
    name: string;
    category: string;
    description: string;
    arguments?: {
        name: string;
        description: string;
        required?: boolean | undefined;
    }[] | undefined;
    userText: string;
}>, "many">;
