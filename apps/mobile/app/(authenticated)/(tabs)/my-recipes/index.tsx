import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function MyRecipesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>My Recipes Screen</Text>
      <Link href="/my-recipes/recipe-detail">
        <Text>Go to Recipe Detail</Text>
      </Link>
      <Link href="/my-recipes/create">
        <Text>Create Recipe</Text>
      </Link>
    </View>
  );
}
