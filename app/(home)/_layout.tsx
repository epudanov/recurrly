import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function HomeLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <View
        className="flex-1 bg-background items-center justify-center"
        role="status"
        aria-busy={true}
        accessible={true}
        accessibilityLabel="Loading"
      >
        <ActivityIndicator size="large" color="#6b5ce7" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
