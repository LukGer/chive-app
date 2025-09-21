import { useDeleteRecipe, useRecipes } from "@/query/recipes.query";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MyRecipesScreen() {
  const { data: recipes, isLoading, error, refetch } = useRecipes();
  const deleteRecipe = useDeleteRecipe();

  const handleDeleteRecipe = async (id: string) => {
    try {
      await deleteRecipe.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete recipe:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>My Recipes</Text>
        <Link href="/my-recipes/create">
          <TouchableOpacity
            style={{ backgroundColor: "#007AFF", padding: 12, borderRadius: 8 }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Create Recipe
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={recipes?.recipes || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#f5f5f5",
              padding: 16,
              marginVertical: 8,
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.title}
              </Text>
              {item.description && (
                <Text style={{ color: "#666", marginTop: 4 }}>
                  {item.description}
                </Text>
              )}
              <View style={{ flexDirection: "row", marginTop: 8, gap: 16 }}>
                {item.servings && <Text>Serves: {item.servings}</Text>}
                {item.prepTimeInMinutes && (
                  <Text>Prep: {item.prepTimeInMinutes}min</Text>
                )}
                {item.cookTimeInMinutes && (
                  <Text>Cook: {item.cookTimeInMinutes}min</Text>
                )}
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Link href={`/my-recipes/recipe-detail?id=${item.id}`}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#34C759",
                    padding: 8,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12 }}>View</Text>
                </TouchableOpacity>
              </Link>
              <TouchableOpacity
                style={{
                  backgroundColor: "#FF3B30",
                  padding: 8,
                  borderRadius: 4,
                }}
                onPress={() => handleDeleteRecipe(item.id)}
              >
                <Text style={{ color: "white", fontSize: 12 }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 50,
            }}
          >
            <Text style={{ color: "#666", fontSize: 16 }}>
              No recipes found
            </Text>
            <Link href="/my-recipes/create">
              <TouchableOpacity
                style={{
                  backgroundColor: "#007AFF",
                  padding: 12,
                  borderRadius: 8,
                  marginTop: 16,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Create Your First Recipe
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        }
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
}
