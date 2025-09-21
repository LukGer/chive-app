import { Colors } from "@/constants/colors";

export function useThemeColor(colorName: keyof typeof Colors.light) {
  return Colors["light"][colorName];
}
