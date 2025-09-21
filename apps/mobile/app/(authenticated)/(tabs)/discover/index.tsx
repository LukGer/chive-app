import { useHeaderSearch } from "@/hooks/use-header-search";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";
import { ScrollView, Text } from "react-native";

export default function FeedScreen() {
  const search = useHeaderSearch();

  const backgroundColor = useThemeColor("background");

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Discover",
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
        <Text>Hello World</Text>
      </ScrollView>
    </>
  );
}
