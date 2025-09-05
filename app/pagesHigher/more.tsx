import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import TabsHeader from "../../components/TabsHeader"; // adjust path if needed
import COLORS from "../../constants/colors"; // adjust path if needed

export default function TranscriptScreen() {
  return (
    <View style={styles.container}>
      <TabsHeader title="Transcript" />

      <View style={styles.content}>
        <Ionicons name="document-text-outline" size={64} color={COLORS.primary} />
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>
          This feature is under development.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 6,
    textAlign: "center",
  },
});
