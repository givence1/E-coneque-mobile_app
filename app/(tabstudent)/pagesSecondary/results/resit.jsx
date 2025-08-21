import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TabsHeader from "../../../../components/TabsHeader";
import COLORS from "../../../../constants/colors";

const resitResults = [
  { course: "Mathematics", code: "MATH101", score: 65, grade: "C" },
  { course: "Anatomy", code: "BIO202", score: 70, grade: "B" },
  { course: "Pharmacology", code: "PHA203", score: 45, grade: "E" },
];

const ResitResults = () => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Fixed Header at the top */}
      <TabsHeader />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 80 }}>
        {/* Page Title */}
        <View style={styles.header}>
          <Ionicons name="refresh-circle" size={24} color={COLORS.primary} />
          <Text style={styles.headerText}>Resit Results</Text>
        </View>

        {/* Results Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.bold]}>Course</Text>
          <Text style={[styles.cell, styles.bold]}>Code</Text>
          <Text style={[styles.cell, styles.bold]}>Score</Text>
          <Text style={[styles.cell, styles.bold]}>Grade</Text>
        </View>

        {resitResults.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.cell}>{item.course}</Text>
            <Text style={styles.cell}>{item.code}</Text>
            <Text style={styles.cell}>{item.score}</Text>
            <Text style={styles.cell}>{item.grade}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ResitResults;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  cell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  bold: {
    fontWeight: "bold",
  },
});
