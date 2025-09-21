import { z } from "zod";
import { IngredientSchema } from "./ingredient.schema";
import { InstructionSchema } from "./instruction.schema";
import { RecipeResponseSchema } from "./recipe-response.schema";
import { TagSchema } from "./tag.schema";

export const RecipeWithDetailsSchema = RecipeResponseSchema.extend({
  ingredients: z.array(IngredientSchema),
  instructions: z.array(InstructionSchema),
  tags: z.array(TagSchema),
});

export type RecipeWithDetails = z.infer<typeof RecipeWithDetailsSchema>;
