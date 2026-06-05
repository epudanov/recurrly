import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { formatCurrency } from "@/lib/utils/common";
import "@/styles/global.css";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView as SafeAreaViewBase } from "react-native-safe-area-context";
import UpcomingSubscriptionCard from "../components/upcoming-subscription";

const SafeAreaView = styled(SafeAreaViewBase);

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-4 items-between bg-background">
      <View>
        <View className="home-header">
          <View className="home-user">
            <Image source={images.avatar} className="home-avatar" />
            <Text className="home-user-name">{HOME_USER.name}</Text>
          </View>

          <Image source={icons.add} className="home-add-icon" />
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
        <FlatList
          data={HOME_SUBSCRIPTIONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="min-h-30 bg-subscription my-2.5 p-4 rounded-lg">
              <Text>{item.name}</Text>
            </View>
          )}
          ListEmptyComponent={() => <Text>No active subscriptions</Text>}
        />
      </View>
    </SafeAreaView>
  );
}
