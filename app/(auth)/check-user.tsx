import COLORS from "@/constants/colors";
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

export default function CheckUserScreen() {
  const router = useRouter();
  const { schoolIdentification } = useAuthStore();
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      Alert.alert(t("ui.error"), t("ui.enterUsername"));
      return;
    }

    try {
      setLoading(true);
      const url = `${protocol}${tenant}${RootApi}/check_user/`;

      // 👉 Call backend
      const res = await actionSubmit({ username: username.trim() }, url);

      if (res?.exists) {
        // ✅ User found → go to create password page
        Alert.alert(
          t("ui.success"),
          t("ui.userFound"),
          [{ text: "OK", onPress: () => router.push("/(auth)/enter-token") }]
        );
      } else {
        // ❌ User not found → show error
        Alert.alert(t("ui.error"), t("ui.userNotExist"));
      }
    } catch (err) {
      Alert.alert(t("ui.error"), t("ui.somethingWrong"));
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = () => {
      const message = t("support.resetMessage");
      const url = `https://wa.me/${schoolIdentification?.supportNumberOne}?text=${encodeURIComponent(message)}`;
      Linking.openURL(url);
    };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* School Name */}
        <Text style={styles.schoolName}>
          {schoolIdentification?.name || t("ui.mySchool")}
        </Text>

        {/* Title */}
        <Text style={styles.title}>{t("ui.checkUser")}</Text>

        {/* Label */}
        <Text style={styles.label}>{t("ui.matriculeOrUsername")}</Text>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder={t("ui.enterUsernamePlaceholder")}
          placeholderTextColor={COLORS.placeholderText}
          value={username}
          onChangeText={setUsername}
        />

        {/* Back to Login */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>{t("ui.backToLogin")}</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t("ui.checking") : t("ui.checkNow")}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer */}
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
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginBottom: 6,
    alignSelf: "flex-start",
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
