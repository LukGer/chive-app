import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../api/http-client";
import { RecipeClient } from "../api/recipe-client";
import {
  CreateRecipeInput,
  CreateUserRecipeInput,
  RecipeListQuery,
  UpdateRecipeInput,
} from "../types/recipe";

// Create a simple client instance
const client = new RecipeClient(httpClient);

export const recipeKeys = {
  all: ["recipes"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  list: (query?: RecipeListQuery) => [...recipeKeys.lists(), query] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
  stats: () => [...recipeKeys.all, "stats"] as const,
};

export const useRecipes = (query?: RecipeListQuery) => {
  return useQuery({
    queryKey: recipeKeys.list(query),
    queryFn: () => client.listRecipes(query),
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => client.getRecipe(id),
    enabled: !!id,
  });
};

export const useRecipeStats = () => {
  return useQuery({
    queryKey: recipeKeys.stats(),
    queryFn: () => client.getRecipeStats(),
  });
};

// Mutations
export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeInput) => client.createRecipe(data),
    onSuccess: () => {
      // Invalidate and refetch recipes list
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
};

export const useCreateUserRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRecipeInput) => client.createUserRecipe(data),
    onSuccess: () => {
      // Invalidate and refetch recipes list
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecipeInput }) =>
      client.updateRecipe(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate specific recipe and recipes list
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => client.deleteRecipe(id),
    onSuccess: () => {
      // Invalidate recipes list
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
};
