import { z } from "zod";

export const IngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required").max(255),
  quantity: z.number().positive().optional(),
  unit: z.string().max(50).optional(),
  raw: z.string().optional(),
});

export const CreateIngredientSchema = IngredientSchema.extend({
  position: z.number().int().min(0),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type CreateIngredient = z.infer<typeof CreateIngredientSchema>;
