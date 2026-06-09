import { Redirect } from "expo-router";

export default function HomeScreen() {
  // Redirect directly to tabs (as per requirement)
  return <Redirect href="/(tabs)" />;
}
