import { z } from "zod";

export type ToolCategory =
  | "capture"
  | "extraction"
  | "skills"
  | "discovery"
  | "research"
  | "annotate";

export interface PublicTool {
  name: string;
  category: ToolCategory;
  summary: string;
}

export declare const PUBLIC_TOOLS: readonly PublicTool[];
export declare const PUBLIC_TOOL_NAMES: string[];
export declare const PUBLIC_TOOL_COUNT: number;
export declare const publicToolsSchema: z.ZodArray<
  z.ZodObject<{
    name: z.ZodString;
    category: z.ZodString;
    summary: z.ZodString;
  }>
>;
