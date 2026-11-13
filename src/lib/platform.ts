import { z } from "zod";

export const platformInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  category: z.string().trim().min(1).max(50),
  description: z.string().trim().min(1).max(180),
  url: z.string().trim().max(2048).refine(isOptionalWebUrl),
  logo: z.string().trim().max(2048).refine(isOptionalWebUrl),
  status: z.enum(["available", "maintenance"]),
  enabled: z.boolean(),
}).strict();

function isOptionalWebUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export type PlatformInput = z.infer<typeof platformInputSchema>;
export type Platform = PlatformInput & {
  id: string;
  position: number;
  accessCount: number;
};
