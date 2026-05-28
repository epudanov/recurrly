import "@/styles/global.css";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as SafeAreaViewBase } from "react-native-safe-area-context";

const SafeAreaView = styled(SafeAreaViewBase);

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold">Index Screen</Text>
    </SafeAreaView>
  );
}
