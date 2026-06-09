import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";

export default function SignInScreen() {
  const { signIn, isLoading } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignIn = async () => {
    setErrors({});

    if (!emailAddress.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!password.trim()) {
      setErrors({ password: "Password is required" });
      return;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        // Redirect to tabs after successful sign-in
        router.replace("/(tabs)");
      } else {
        setErrors({ submit: "Sign in failed. Please try again." });
      }
    } catch (error: any) {
      setErrors({
        submit: error?.errors?.[0]?.message || "Invalid email or password",
      });
    }
  };

  return (
    <View className="flex-1 bg-background px-5 py-8 justify-center">
      <Text className="text-3xl font-sans-bold text-primary mb-2">Welcome back</Text>
      <Text className="text-sm text-muted-foreground mb-6">
        Sign in to your account
      </Text>

      <Text className="text-sm font-sans-semibold text-primary mb-2">
        Email address
      </Text>
      <TextInput
        className="border-2 border-muted bg-card p-4 rounded-lg text-primary placeholder:text-muted-foreground mb-4 font-sans"
        placeholder="you@example.com"
        value={emailAddress}
        onChangeText={setEmailAddress}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      {errors.email && (
        <Text className="text-destructive text-xs font-sans-medium mb-3">
          {errors.email}
        </Text>
      )}

      <Text className="text-sm font-sans-semibold text-primary mb-2">
        Password
      </Text>
      <TextInput
        className="border-2 border-muted bg-card p-4 rounded-lg text-primary placeholder:text-muted-foreground mb-4 font-sans"
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />
      {errors.password && (
        <Text className="text-destructive text-xs font-sans-medium mb-3">
          {errors.password}
        </Text>
      )}

      <Pressable
        className={`bg-accent rounded-lg py-4 px-6 items-center justify-center ${
          isLoading ? "opacity-50" : ""
        }`}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-sans-semibold text-base">
            Continue
          </Text>
        )}
      </Pressable>

      {errors.submit && (
        <Text className="text-destructive text-xs font-sans-medium mt-4 text-center">
          {errors.submit}
        </Text>
      )}

      <View className="flex-row items-center justify-center mt-6 gap-1">
        <Text className="text-primary">Don't have an account? </Text>
        <Link href="/(auth)/sign-up">
          <Text className="text-accent font-sans-semibold">Sign up</Text>
        </Link>
      </View>
    </View>
  );
}
