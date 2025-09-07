import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TabsHeader from "../../../components/lecturerHeader/TabsHeader";
import COLORS from "../../../constants/colors";

export default function GradesScreen() {
  const grades = [
    { id: "1", student: "John Doe", course: "Mathematics", grade: "B+" },
    { id: "2", student: "Jane Smith", course: "Electronics", grade: "A" },
  ];

  return (
    <View style={styles.container}>
      <TabsHeader title="Grades" />
      <ScrollView
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 30, paddingHorizontal: 16 }}
      >
        {grades.map((g) => (
          <View key={g.id} style={styles.card}>
            <Text style={styles.cardTitle}>{g.student}</Text>
            <Text style={styles.cardSub}>Course: {g.course}</Text>
            <Text style={styles.cardSub}>Grade: {g.grade}</Text>
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
