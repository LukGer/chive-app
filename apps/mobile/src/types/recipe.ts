// Re-export types directly from the backend API
export type {
  CreateIngredient,
  CreateInstruction,
  CreateRecipeInput,
  CreateUserRecipeInput,
  Ingredient,
  Instruction,
  RecipeListQuery,
  RecipeListResponse,
  RecipeResponse,
  RecipeStats,
  RecipeWithDetails,
  Tag,
  UpdateRecipeInput,
} from "@chive/api/src/features/recipe-management/schemas";

// Create a simple ApiError type for the client
export interface ApiError {
  error: string;
}
