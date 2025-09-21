import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "dev";
const IS_PREVIEW = process.env.APP_VARIANT === "pre";

const getAppName = () => {
  if (IS_DEV) {
    return "Chive - DEV";
  }

  if (IS_PREVIEW) {
    return "Chive - PRE";
  }

  return "Chive";
};

const getUniqueBundleId = () => {
  if (IS_DEV) {
    return "dev.lukger.chive.dev";
  }

  if (IS_PREVIEW) {
    return "dev.lukger.chive.pre";
  }

  return "dev.lukger.chive";
};

const getAppScheme = () => {
  if (IS_DEV) {
    return "chive-dev";
  }

  if (IS_PREVIEW) {
    return "chive-pre";
  }

  return "chive-app";
};

const getAppIcons = () => {
  if (IS_DEV) {
    return "./assets/icons/chive_prd.icon";
  }

  if (IS_PREVIEW) {
    return "./assets/icons/chive_prd.icon";
  }

  return "./assets/icons/chive_prd.icon";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: getAppName(),
  slug: "chive",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: getAppScheme(),
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueBundleId(),
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    icon: getAppIcons(),
    appleTeamId: "WUBYBH9K9B",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#FAF8F5",
      },
    ],
    "expo-web-browser",
    "expo-secure-store",
    "expo-font",
    "expo-sqlite",
    "@bacons/apple-targets",
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
