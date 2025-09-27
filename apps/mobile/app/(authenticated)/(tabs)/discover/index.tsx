import { useThemeColor } from "@/hooks/useThemeColor";
import { GlassView } from "expo-glass-effect";
import { Link, Stack } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function SearchScreen() {
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
          headerRight: () => (
            <GlassView style={styles.headerButton} glassEffectStyle="clear">
              <SymbolView name="person" />
            </GlassView>
          ),
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

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
    borderRadius: 100,
  },
});
