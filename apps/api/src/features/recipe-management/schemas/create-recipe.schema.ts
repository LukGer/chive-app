import { z } from "zod";
import { CreateIngredientSchema } from "./ingredient.schema";
import { CreateInstructionSchema } from "./instruction.schema";
import { RecipeStatusSchema } from "./recipe-status.schema";

export const CreateRecipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  servings: z.number().int().positive().optional(),
  prepTimeInMinutes: z.number().int().min(0).optional(),
  cookTimeInMinutes: z.number().int().min(0).optional(),
  totalTimeInMinutes: z.number().int().min(0).optional(),
  imageUrl: z.url().optional(),
  sourceUrl: z.url().optional(),
  sourceName: z.string().max(255).optional(),
  status: RecipeStatusSchema.default("processed").optional(),
  provenance: z.record(z.string(), z.any()).optional(),
  confidence: z.number().min(0).max(1).optional(),
  ingredients: z
    .array(CreateIngredientSchema)
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(CreateInstructionSchema)
    .min(1, "At least one instruction is required"),
});

export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema>;
