import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TranscriptScreen() {
  // Mock values (replace with actual API data)
  const platformPaid = true;   // boolean
  const schoolFeesPaid = false; // boolean

  const canApplyTranscript = platformPaid && schoolFeesPaid;

  const handleTranscriptApply = () => {
    if (canApplyTranscript) {
      // 👇 call your apply transcript API or navigate
      console.log("Transcript application submitted!");
    }
  };

  const handleAttestationApply = () => {
    console.log("School attestation application submitted!");
  };

  return (
    <View style={styles.container}>
      <AppHeader showBack  showTitle  />

      {/* Transcript Application Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Transcript Application</Text>
        <Text style={styles.cardDescription}>
          You may now apply for your transcript once all school fees are
          completed and the platform fee has been paid.
        </Text>

        <View style={styles.row}>
          <Ionicons
            name={platformPaid ? "checkmark-circle" : "close-circle"}
            size={20}
            color={platformPaid ? "green" : "red"}
          />
          <Text style={styles.rowText}>Platform Charge</Text>
        </View>

        <View style={styles.row}>
          <Ionicons
            name={schoolFeesPaid ? "checkmark-circle" : "close-circle"}
            size={20}
            color={schoolFeesPaid ? "green" : "red"}
          />
          <Text style={styles.rowText}>School Fees</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: canApplyTranscript ? COLORS.primary : COLORS.border },
          ]}
          disabled={!canApplyTranscript}
          onPress={handleTranscriptApply}
        >
          <Text
            style={[
              styles.buttonText,
              { color: canApplyTranscript ? "#fff" : COLORS.textSecondary },
            ]}
          >
            Apply for Transcript
          </Text>
        </TouchableOpacity>
      </View>

      {/* School Attestation Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>School Attestation</Text>
        <Text style={styles.cardDescription}>
          You may apply for your school attestation at any time. No payment or
          additional fee is required.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleAttestationApply}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>
            Apply for Attestation
          </Text>
        </TouchableOpacity>
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
