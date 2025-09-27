import { Text, View } from "react-native";

export default function ShoppingListScreen() {
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
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Shopping List</Text>
      </View>
    </View>
  );
}
