import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import Header from "../../../components/Header";
import COLORS from "../../../constants/colors";

const caResults = [
  { course: "OBSTETRIC NURSING II", ca: 20 },
  { course: "INTENSIVE CARE I", ca: 40 },
  { course: "PEDIATRIC PATHOLOGY/NURSING I", ca: 30.5 },
];

export default function CAResults() {
  return (
    <ScrollView style={styles.container}>
      <Header title="CA Results" />

      <Text style={styles.title}>Continuous Assessment</Text>

      <View style={styles.table}>
        <View style={styles.rowHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>Course</Text>
          <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>CA</Text>
          <Text style={[styles.cell, { flex: 0.6, textAlign: "center" }]}>Status</Text>
        </View>

        {caResults.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, { flex: 2 }]}>{item.course}</Text>
            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{item.ca}</Text>
            <Text style={[styles.cell, { flex: 0.6, textAlign: "center" }]}>
              {item.ca >= 30 ? "✅" : "❌"}
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
