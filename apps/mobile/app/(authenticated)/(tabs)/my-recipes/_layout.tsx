import { Stack } from "expo-router";

export default function MyRecipesStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My Recipes" }} />
      <Stack.Screen
        name="recipe-detail"
        options={{ title: "Recipe Details" }}
      />
      <Stack.Screen name="create" options={{ title: "Create Recipe" }} />
    </Stack>
  );
}
