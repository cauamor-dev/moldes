import { z } from "zod";

export const briefInput = z.object({
  goal: z.string().min(2),
  sector: z.string().optional(),
  boldness: z.number().int().min(1).max(5).optional(),
  slugs: z.array(z.string()).optional(),
  client: z.string().optional(),
});

export const designMdInput = z
  .object({ slugs: z.array(z.string()).optional(), brief: briefInput.optional(), name: z.string().optional() })
  .refine((v) => v.slugs?.length || v.brief, "informe slugs ou brief");

export const usageInput = z.object({ client: z.string().min(1), project: z.string().min(1), slugs: z.array(z.string()).min(1) });
