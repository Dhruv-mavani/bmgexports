"use client";

import { useEffect } from "react";
import { diamonds } from "@/data/diamonds";
import { abs } from "@/lib/site";

// Exposes the site's capabilities as tools to browser agents via WebMCP (navigator.modelContext).
// Feature-detected: browsers without WebMCP simply skip this.

type ToolResult = { content: { type: "text"; text: string }[] };
type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
};
type ModelContext = {
  registerTool?: (tool: Tool) => unknown;
  unregisterTool?: (name: string) => unknown;
  provideContext?: (ctx: { tools: Tool[] }) => unknown;
};

const text = (value: unknown): ToolResult => ({ content: [{ type: "text", text: JSON.stringify(value) }] });

const summarise = (d: (typeof diamonds)[number]) => ({
  id: d.id,
  name: `${d.carat.toFixed(2)} ct ${d.shape}`,
  shape: d.shape,
  carat: d.carat,
  colour: d.color,
  clarity: d.clarity,
  cut: d.cut,
  certificate: d.certificate,
  url: abs(`/collection/${d.id}`),
});

const tools: Tool[] = [
  {
    name: "list_diamonds",
    description: "List the diamonds in the BGM Exports collection, optionally filtered by shape and carat weight.",
    inputSchema: {
      type: "object",
      properties: {
        shape: { type: "string", description: "Shape, e.g. Radiant, Cushion or Oval" },
        min_carat: { type: "number", description: "Minimum carat weight" },
        max_carat: { type: "number", description: "Maximum carat weight" },
      },
    },
    execute: (args) => {
      const shape = typeof args.shape === "string" ? args.shape.toLowerCase() : "";
      const min = typeof args.min_carat === "number" ? args.min_carat : 0;
      const max = typeof args.max_carat === "number" ? args.max_carat : Infinity;
      return text(diamonds.filter((d) => (!shape || d.shape.toLowerCase() === shape) && d.carat >= min && d.carat <= max).map(summarise));
    },
  },
  {
    name: "get_diamond",
    description: "Get the full details of one diamond by its id (for example bgm-001).",
    inputSchema: { type: "object", properties: { id: { type: "string", description: "Stone id" } }, required: ["id"] },
    execute: (args) => {
      const d = diamonds.find((x) => x.id === args.id);
      return text(d ? summarise(d) : { error: `No stone with id ${String(args.id)}` });
    },
  },
  {
    name: "start_enquiry",
    description:
      "Open the enquiry form, optionally pre-filled with a stone id. This only opens the form: the user must review it and press Send themselves.",
    inputSchema: { type: "object", properties: { stone_id: { type: "string", description: "Optional stone id to enquire about" } } },
    execute: (args) => {
      const id = typeof args.stone_id === "string" ? args.stone_id : "";
      window.location.assign(id ? `/contact?stone=${encodeURIComponent(id)}` : "/contact");
      return text({ opened: "enquiry form", stone_id: id || null });
    },
  },
];

export default function WebMcp() {
  useEffect(() => {
    const mc = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    if (!mc) return;

    try {
      if (mc.registerTool) tools.forEach((t) => mc.registerTool?.(t));
      else mc.provideContext?.({ tools });
    } catch {
      // Tool registration is best-effort; a repeated registration must never break the page.
    }
    return () => {
      try {
        tools.forEach((t) => mc.unregisterTool?.(t.name));
      } catch {
        /* ignore */
      }
    };
  }, []);

  return null;
}
