import { useAuthStore } from "@/store/authStore";
import { protocol, RootApi, tenant } from "@/utils/config";
import { actionSubmit } from "@/utils/functions";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { schoolIdentification } = useAuthStore();
  const [email, setEmail] = useState("");

  const handleSupport = () => {
    const phoneNumber = "237673351854";
    const message = t("support.resetMessage");
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
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
    const res = await actionSubmit(
      { email: email?.toString().toLowerCase() },
      url
    );

    if (res?.status.toString() === "OK") {
      Alert.alert(
        t("messages.success"),
        t("messages.resetTokenSent"),
        [
          {
            text: "OK",
            onPress: () => router.push("/(auth)/enter-token"),
          },
        ]
      );
    } else {
      Alert.alert(t("messages.error"), t("messages.resetTokenFailed"));
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.schoolName}>
          {schoolIdentification?.name || t("ui.mySchool")}
        </Text>

        <Text style={styles.title}>{t("login.forgotPasswordTitle")}</Text>
        <Text style={styles.subtitle}>{t("login.forgotPasswordSubtitle")}</Text>

        <TextInput
          style={styles.input}
          placeholder={t("login.enterEmail")}
          placeholderTextColor={COLORS.placeholderText}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>{t("login.backToLogin")}</Text>
        </TouchableOpacity>

        {validateEmail() ? (
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t("ui.sending") : t("ui.sendResetToken")}
            </Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.divider} />

        <TouchableOpacity onPress={handleSupport}>
          <Text style={styles.link}>{t("ui.contactSupport")}</Text>
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
