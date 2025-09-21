import { useHeaderSearch } from "@/hooks/use-header-search";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Link, Stack } from "expo-router";
import { ScrollView, Text } from "react-native";

export default function SearchScreen() {
  const search = useHeaderSearch();

  const backgroundColor = useThemeColor("background");

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Search",
          headerLargeTitle: true,
          headerTransparent: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          headerLargeStyle: {
            backgroundColor: "transparent",
          },
          headerStyle: {
            backgroundColor: "transparent",
          },
          contentStyle: {
            backgroundColor: backgroundColor,
          },
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text>Search Screen</Text>
        <Link href="/discover/recipe-detail">
          <Text>Go to Recipe Detail</Text>
        </Link>
      </ScrollView>
    </>
  );
}
