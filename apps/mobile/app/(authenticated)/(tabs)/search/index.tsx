import { useHeaderSearch } from "@/hooks/use-header-search";
import { Text, View } from "react-native";

export default function SearchScreen() {
  const search = useHeaderSearch();

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
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Search</Text>
        <Text>{search}</Text>
      </View>
    </View>
  );
}
