// ============================================================
// Common Zod Validators
// ============================================================

import { z } from "zod";

/**
 * Validates route parameter containing an ID.
 * Prevents empty or malformed strings.
 */
export const idParamSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Resource ID is required")
    .max(128, "Resource ID is too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "Malformed ID format"),
});

export type IdParam = z.infer<typeof idParamSchema>;
