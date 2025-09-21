import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useCreateUserRecipe,
  useDeleteRecipe,
  useRecipes,
} from "../query/recipes.query";
import { CreateUserRecipeInput } from "../types/recipe";

export const RecipeList: React.FC = () => {
  const {
    data: recipes,
    isLoading,
    error,
    refetch,
  } = useRecipes({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const createRecipe = useCreateUserRecipe();
  const deleteRecipe = useDeleteRecipe();

  const handleCreateRecipe = async () => {
    const newRecipe: CreateUserRecipeInput = {
      title: "Test Recipe",
      description: "A test recipe created from the app",
      servings: 4,
      prepTimeInMinutes: 15,
      cookTimeInMinutes: 30,
      ingredients: [
        { name: "Pasta", quantity: 1, unit: "cup", position: 0 },
        { name: "Tomato Sauce", quantity: 2, unit: "cups", position: 1 },
      ],
      instructions: [
        { text: "Boil water in a large pot", position: 0 },
        {
          text: "Add pasta and cook according to package directions",
          position: 1,
        },
        { text: "Heat tomato sauce in a separate pan", position: 2 },
        { text: "Drain pasta and mix with sauce", position: 3 },
      ],
      tags: ["italian", "pasta", "quick"],
    };

    try {
      await createRecipe.mutateAsync(newRecipe);
      Alert.alert("Success", "Recipe created successfully!");
    } catch {
      Alert.alert("Error", "Failed to create recipe");
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipe.mutateAsync(id);
              Alert.alert("Success", "Recipe deleted successfully!");
            } catch {
              Alert.alert("Error", "Failed to delete recipe");
            }
          },
        },
      ]
    );
  };

  const renderRecipe = ({ item }: { item: any }) => (
    <View style={styles.recipeItem}>
      <Text style={styles.recipeTitle}>{item.title}</Text>
      {item.description && (
        <Text style={styles.recipeDescription}>{item.description}</Text>
      )}
      <View style={styles.recipeMeta}>
        {item.servings && <Text>Serves: {item.servings}</Text>}
        {item.prepTimeInMinutes && (
          <Text>Prep: {item.prepTimeInMinutes}min</Text>
        )}
        {item.cookTimeInMinutes && (
          <Text>Cook: {item.cookTimeInMinutes}min</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteRecipe(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateRecipe}
      >
        <Text style={styles.createButtonText}>Create Test Recipe</Text>
      </TouchableOpacity>

      <FlatList
        data={recipes?.recipes || []}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipe}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No recipes found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  recipeItem: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  recipeMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  createButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  createButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 32,
  },
});
