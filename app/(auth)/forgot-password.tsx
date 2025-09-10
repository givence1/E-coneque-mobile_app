import { useAuthStore } from "@/store/authStore";
import { protocol, RootApi, tenant } from "@/utils/config";
import { actionSubmit } from "@/utils/functions";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { schoolIdentification } = useAuthStore(); // ✅ get school name from store
  const [email, setEmail] = useState("");

  const handleSupport = () => {
    const phoneNumber = "237673351854";
    const message = "Hello, I need help resetting my password.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const validateEmail = (): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!validateEmail()) return;
    const url = `${protocol}${tenant}${RootApi}/password_reset/`;

    const res = await actionSubmit({ email: email?.toString().toLowerCase() }, url);

    if (res?.status.toString() === "OK") {
      // ✅ Show success alert and redirect
      Alert.alert(
        "Success",
        "A reset token has been sent to your email. Please check your inbox.",
        [
          {
            text: "OK",
            onPress: () => {
              // 👉 Navigate to token entry page
              router.push("/(auth)/enter-token");
            },
          },
        ]
      );
    } else {
      Alert.alert("Error", "Failed to send reset token. Please try again.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.schoolName}>{schoolIdentification?.name || "My School"}</Text>

        <Text style={styles.title}>Forgotten Password</Text>
        <Text style={styles.subtitle}>Enter the email of your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor={COLORS.placeholderText}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>

        {validateEmail() ? (
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? "Sending..." : "Send Reset Token"}
            </Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.divider} />

        <TouchableOpacity onPress={handleSupport}>
          <Text style={styles.link}>Contact Support</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>@2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 12,
  },
  link: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
});
