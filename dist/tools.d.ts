/**
 * Public MCP tool manifest — 71 canonical tools across 4 tiers.
 *
 * Canonical manifest of tools exposed across Core, Plus, Pro, and Realm tiers.
 * Full schemas + handlers live on the hosted server; this manifest is here for
 * directory listings, discovery cards, and client-side validation.
 */
import { z } from "zod";
export type ToolTier = "core" | "plus" | "pro" | "realm";
export type ToolCategory = "capture" | "extraction" | "skills" | "discovery" | "research" | "annotate" | "workspace" | "studios" | "cards" | "collections" | "local_silicon" | "assets" | "agent" | "production" | "realm";
export interface PublicTool {
    name: string;
    category: ToolCategory;
    tier: ToolTier;
    summary: string;
}
export declare const PUBLIC_TOOLS: readonly PublicTool[];
export declare const PUBLIC_TOOL_NAMES: string[];
export declare const PUBLIC_TOOL_COUNT: number;
export declare const publicToolsSchema: z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    category: z.ZodString;
    tier: z.ZodString;
    summary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    category: string;
    tier: string;
    summary: string;
}, {
    name: string;
    category: string;
    tier: string;
    summary: string;
}>, "many">;
