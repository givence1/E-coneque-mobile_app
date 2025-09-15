import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TranscriptScreen() {
  const { t } = useTranslation();

  // Mock values (replace with actual API data)
  const platformPaid = false; // boolean
  const schoolFeesPaid = true; // boolean

  const canApplyTranscript = platformPaid && schoolFeesPaid;

  const handleTranscriptApply = () => {
    if (canApplyTranscript) {
      // ✅ proceed to transcript application
      console.log(t("transcript.submitted"));
    } else {
      // ❌ Show message about missing fees
      let missing: string[] = [];
      if (!platformPaid) missing.push(t("transcript.platformFee"));
      if (!schoolFeesPaid) missing.push(t("transcript.schoolFees"));

      Alert.alert(
        t("transcript.paymentRequired"),
        t("transcript.paymentMessage", { missing: missing.join(" & ") })
      );
    }
  };

  const handleAttestationApply = () => {
    console.log(t("transcript.attestationSubmitted"));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* ✅ Fixed header outside the ScrollView */}
      <AppHeader showBack showTitle />
      <View style={[styles.container, { paddingTop: 70 }]}>
        {/* Transcript Application Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("transcript.title")}</Text>
          <Text style={styles.cardDescription}>
            {t("transcript.description")}
          </Text>

          <View style={styles.row}>
            <Ionicons
              name={platformPaid ? "checkmark-circle" : "close-circle"}
              size={20}
              color={platformPaid ? "green" : "red"}
            />
            <Text style={styles.rowText}>{t("transcript.platformFee")}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name={schoolFeesPaid ? "checkmark-circle" : "close-circle"}
              size={20}
              color={schoolFeesPaid ? "green" : "red"}
            />
            <Text style={styles.rowText}>{t("transcript.schoolFees")}</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.primary }]}
            onPress={handleTranscriptApply}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>
              {t("transcript.apply")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* School Attestation Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t("attestation.title")}</Text>
          <Text style={styles.cardDescription}>
            {t("attestation.description")}
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.primary }]}
            onPress={handleAttestationApply}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>
              {t("attestation.apply")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rowText: {
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  button: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
