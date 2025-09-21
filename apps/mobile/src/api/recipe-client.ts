import {
  CreateRecipeInput,
  CreateUserRecipeInput,
  RecipeListQuery,
  RecipeListResponse,
  RecipeResponse,
  RecipeStats,
  RecipeWithDetails,
  UpdateRecipeInput,
} from "../types/recipe";
import { httpClient } from "./http-client";

export class RecipeClient {
  constructor(private http: typeof httpClient) {}

  // Recipe CRUD operations
  async createRecipe(data: CreateRecipeInput): Promise<RecipeResponse> {
    return this.http.post<RecipeResponse>("/recipes", data);
  }

  async createUserRecipe(data: CreateUserRecipeInput): Promise<RecipeResponse> {
    return this.http.post<RecipeResponse>("/recipes/user", data);
  }

  async getRecipe(id: string): Promise<RecipeWithDetails> {
    return this.http.get<RecipeWithDetails>(`/recipes/${id}`);
  }

  async listRecipes(query?: RecipeListQuery): Promise<RecipeListResponse> {
    return this.http.get<RecipeListResponse>("/recipes", { params: query });
  }

  async updateRecipe(
    id: string,
    data: UpdateRecipeInput
  ): Promise<RecipeResponse> {
    return this.http.put<RecipeResponse>(`/recipes/${id}`, data);
  }

  async deleteRecipe(id: string): Promise<void> {
    return this.http.delete<void>(`/recipes/${id}`);
  }

  async getRecipeStats(): Promise<RecipeStats> {
    return this.http.get<RecipeStats>("/recipes/stats");
  }
}
