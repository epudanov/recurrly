import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Onboarding() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Onboarding!
      </Text>
      <Link
        href="/(tabs)/subscriptions"
        className="mt-4 px-4 py-2 bg-blue-500 rounded"
      >
        Go to Tabs
      </Link>
    </View>
  );
}
