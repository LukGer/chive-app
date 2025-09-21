import { z } from "zod";
import { CreateIngredientSchema } from "./ingredient.schema";
import { CreateInstructionSchema } from "./instruction.schema";

export const CreateUserRecipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  servings: z.number().int().positive().optional(),
  prepTimeInMinutes: z.number().int().min(0).optional(),
  cookTimeInMinutes: z.number().int().min(0).optional(),
  totalTimeInMinutes: z.number().int().min(0).optional(),
  imageUrl: z.url().optional(),
  sourceUrl: z.url().optional(),
  sourceName: z.string().max(255).optional(),
  ingredients: z
    .array(CreateIngredientSchema)
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(CreateInstructionSchema)
    .min(1, "At least one instruction is required"),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

export type CreateUserRecipeInput = z.infer<typeof CreateUserRecipeSchema>;
