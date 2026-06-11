import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SignUpScreen() {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stage, setStage] = useState<"credentials" | "verification">(
    "credentials",
  );
  const [fetchStatus, setFetchStatus] = useState<"idle" | "fetching">("idle");

  const handleSignUp = async () => {
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
      setFetchStatus("fetching");
      const { error } = await signUp.password({
        emailAddress,
        password,
      });
      setFetchStatus("idle");
      if (error) {
        setErrors({ submit: error.message });
        return;
      }

      setFetchStatus("fetching");
      await signUp.verifications.sendEmailCode();
      setFetchStatus("idle");
      setStage("verification");
    } catch (error: any) {
      setFetchStatus("idle");
      setErrors({
        submit:
          error?.errors?.[0]?.message || "Sign up failed. Please try again.",
      });
    }
  };

  const handleVerifyEmail = async () => {
    setErrors({});

    if (!code.trim()) {
      setErrors({ code: "Verification code is required" });
      return;
    }

    try {
      setFetchStatus("fetching");
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      setFetchStatus("idle");
      if (error) {
        setErrors({ code: error.message });
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize();
        // Redirect to tabs after successful sign-up
        router.replace("/(tabs)");
      } else {
        setErrors({ submit: "Verification failed. Please try again." });
      }
    } catch (error: any) {
      setFetchStatus("idle");
      setErrors({
        code: error?.errors?.[0]?.message || "Invalid verification code",
      });
    }
  };

  const handleResendCode = async () => {
    try {
      setFetchStatus("fetching");
      await signUp.verifications.sendEmailCode();
      setFetchStatus("idle");
      setErrors({});
    } catch (error: any) {
      setFetchStatus("idle");
      setErrors({
        submit: error?.message || "Failed to resend code",
      });
    }
  };

  if (stage === "verification") {
    return (
      <View className="flex-1 bg-background px-5 py-8 justify-center">
        <Text className="text-3xl font-sans-bold text-primary mb-6">
          Verify your email
        </Text>

        <Text className="text-sm font-sans-medium text-muted-foreground mb-2">
          We sent a code to {emailAddress}
        </Text>

        <TextInput
          className="border-2 border-muted bg-background p-4 rounded-lg text-primary placeholder:text-muted-foreground mb-3 font-sans"
          placeholder="Enter verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          editable={fetchStatus !== "fetching"}
        />
        {errors.code && (
          <Text className="text-destructive text-xs font-sans-medium mb-3">
            {errors.code}
          </Text>
        )}

        <Pressable
          className={`bg-accent rounded-lg py-4 px-6 items-center justify-center ${
            fetchStatus === "fetching" ? "opacity-50" : ""
          }`}
          onPress={handleVerifyEmail}
          disabled={fetchStatus === "fetching"}
        >
          {fetchStatus === "fetching" ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-sans-semibold text-base">
              Verify
            </Text>
          )}
        </Pressable>

        <Pressable
          className="border-2 border-primary rounded-lg py-4 px-6 items-center justify-center mt-3"
          onPress={handleResendCode}
          disabled={fetchStatus === "fetching"}
        >
          <Text className="text-primary font-sans-semibold">
            Didn&apos;t receive a code? Resend
          </Text>
        </Pressable>

        <Pressable
          className={`border-2 border-muted rounded-lg py-3 px-6 items-center justify-center mt-3 ${
            fetchStatus === "fetching" ? "opacity-50" : ""
          }`}
          onPress={() => setStage("credentials")}
          disabled={fetchStatus === "fetching"}
        >
          <Text className="text-muted-foreground font-sans-semibold">
            Change email
          </Text>
        </Pressable>

        {errors.submit && (
          <Text className="text-destructive text-xs font-sans-medium mt-3 text-center">
            {errors.submit}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-5 py-8 justify-center">
      <Text className="text-3xl font-sans-bold text-primary mb-2">
        Create account
      </Text>
      <Text className="text-sm text-muted-foreground mb-6">
        Get started with Recurrly
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
        editable={fetchStatus !== "fetching"}
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
        editable={fetchStatus !== "fetching"}
      />
      {errors.password && (
        <Text className="text-destructive text-xs font-sans-medium mb-3">
          {errors.password}
        </Text>
      )}

      <Pressable
        className={`bg-accent rounded-lg py-4 px-6 items-center justify-center ${
          fetchStatus === "fetching" ? "opacity-50" : ""
        }`}
        onPress={handleSignUp}
        disabled={fetchStatus === "fetching"}
      >
        {fetchStatus === "fetching" ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-sans-semibold text-base">
            Create account
          </Text>
        )}
      </Pressable>

      {errors.submit && (
        <Text className="text-destructive text-xs font-sans-medium mt-4 text-center">
          {errors.submit}
        </Text>
      )}

      <View className="flex-row items-center justify-center mt-6 gap-1">
        <Text className="text-primary">Already have an account? </Text>
        <Link href="/(auth)/sign-in">
          <Text className="text-accent font-sans-semibold">Sign in</Text>
        </Link>
      </View>

      <View nativeID="clerk-captcha" />
    </View>
  );
}
