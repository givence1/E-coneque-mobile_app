import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import Header from "../../../../components/Header";
import COLORS from "../../../../constants/colors";

const examResults = [
  { course: "CHILDCARE NUTRITION AND DIETETICS", exam: 45 },
  { course: "MEDICAL SURGICAL NURSING", exam: 55 },
  { course: "RESEARCH METHODOLOGY I", exam: 60 },
];

export default function ExamResults() {
  return (
    <ScrollView style={styles.container}>
      <Header title="Exam Results" />

      <Text style={styles.title}>Semester Exams</Text>

      <View style={styles.table}>
        <View style={styles.rowHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>Course</Text>
          <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>Exam</Text>
          <Text style={[styles.cell, { flex: 0.6, textAlign: "center" }]}>Status</Text>
        </View>

        {examResults.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, { flex: 2 }]}>{item.course}</Text>
            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{item.exam}</Text>
            <Text style={[styles.cell, { flex: 0.6, textAlign: "center" }]}>
              {item.exam >= 50 ? "✅" : "❌"}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    width: "100%"
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  cell: {
    color: COLORS.textDark,
    fontWeight: "500",
  },
});