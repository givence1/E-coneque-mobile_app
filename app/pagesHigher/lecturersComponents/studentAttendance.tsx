import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TabsHeader from "../../../components/lecturerHeader/TabsHeader";
import COLORS from "../../../constants/colors";

export default function AttendanceScreen() {
  const classes = [
    { id: "1", course: "Mathematics", level: "100", attendance: "85%" },
    { id: "2", course: "Electronics", level: "200", attendance: "78%" },
  ];

  return (
    <View style={styles.container}>
      <TabsHeader title="Attendance" />
      <ScrollView
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 30, paddingHorizontal: 16 }}
      >
        {classes.map((c) => (
          <View key={c.id} style={styles.card}>
            <Text style={styles.cardTitle}>{c.course}</Text>
            <Text style={styles.cardSub}>Level {c.level}</Text>
            <Text style={styles.cardSub}>Attendance: {c.attendance}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },
  cardSub: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
});
