import { authClient } from "@/auth/client";
import { LoadingScreen } from "@/components/loading-screen";
import { Redirect } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function TabLayout() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <LoadingScreen message="Loading..." />;
  }

  if (!session) {
    return <Redirect href="/(unauthenticated)/login" />;
  }

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="discover">
        <Label>Discover</Label>
        <Icon sf="compass.drawing" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="my-recipes">
        <Label>My Recipes</Label>
        <Icon sf="book.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="shopping-list">
        <Label>Shopping List</Label>
        <Icon sf="list.bullet" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <Label>Search</Label>
        <Icon sf="magnifyingglass" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
