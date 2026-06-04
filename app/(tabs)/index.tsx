import { HOME_USER } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/styles/global.css";
import { styled } from "nativewind";
import { Image, Text, View } from "react-native";
import { SafeAreaView as SafeAreaViewBase } from "react-native-safe-area-context";

const SafeAreaView = styled(SafeAreaViewBase);

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <View className="home-header">
        <View className="home-user">
          <Image source={images.avatar} className="home-avatar" />
          <Text className="home-user-name">{HOME_USER.name}</Text>
        </View>

        <Image source={icons.add} className="home-add-icon" />
      </View>
    </SafeAreaView>
  );
}
