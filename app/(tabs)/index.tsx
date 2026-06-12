import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils/common";
import "@/styles/global.css";
import { useAuth, useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as SafeAreaViewBase } from "react-native-safe-area-context";
import SubscriptionCard from "../components/subscription-card";
import UpcomingSubscriptionCard from "../components/upcoming-subscription";

const SafeAreaView = styled(SafeAreaViewBase);

export default function App() {
  const router = useRouter();

  const { user } = useUser();
  const { signOut } = useAuth();

  const [activeSubscriptionId, setActiveSubscriptionId] = useState<
    string | null
  >(null);

  const handleSubscriptionPress = (id: string) => {
    setActiveSubscriptionId((prevId) => (prevId === id ? null : id));
  };

  const handleLogOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1 p-4 items-between bg-background">
      <FlatList
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={activeSubscriptionId === item.id}
            onPress={handleSubscriptionPress}
          />
        )}
        contentContainerClassName="pb-30"
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={() => (
          <View>
            <View className="home-header">
              <View className="home-user">
                {user?.imageUrl ? (
                  <Image
                    source={{ uri: user.imageUrl }}
                    className="home-avatar"
                  />
                ) : (
                  <Image source={images.avatar} className="home-avatar" />
                )}
                <Text className="home-user-name">
                  {user?.firstName || "User"}
                </Text>
              </View>

              <Pressable onPress={handleLogOut}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>
            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>
            <FlatList
              data={UPCOMING_SUBSCRIPTIONS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
              ListEmptyComponent={() => <Text>No upcoming subscriptions</Text>}
              contentContainerStyle={{ paddingVertical: 16 }}
              horizontal
            />
          </View>
        )}
        ListEmptyComponent={() => <Text>No active subscriptions</Text>}
        extraData={activeSubscriptionId}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
