import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Feed" }} />
      <Stack.Screen
        name="recipe-detail"
        options={{ title: "Recipe Details" }}
      />
    </Stack>
  );
}
