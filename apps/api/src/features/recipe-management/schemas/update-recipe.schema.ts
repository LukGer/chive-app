import { z } from "zod";
import { CreateRecipeSchema } from "./create-recipe.schema";

export const UpdateRecipeSchema = CreateRecipeSchema.partial();

export type UpdateRecipeInput = z.infer<typeof UpdateRecipeSchema>;
