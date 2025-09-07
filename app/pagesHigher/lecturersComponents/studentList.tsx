import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TabsHeader from "../../../components/lecturerHeader/TabsHeader";
import COLORS from "../../../constants/colors";

export default function StudentsScreen() {
  const students = [
    { id: "1", name: "John Doe", level: "200", matricule: "MAT123" },
    { id: "2", name: "Jane Smith", level: "100", matricule: "MAT456" },
  ];

  return (
    <View style={styles.container}>
      <TabsHeader title="Students" />
      <ScrollView
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 30, paddingHorizontal: 16 }}
      >
        {students.map((s) => (
          <View key={s.id} style={styles.card}>
            <Text style={styles.cardTitle}>{s.name}</Text>
            <Text style={styles.cardSub}>Matricule: {s.matricule}</Text>
            <Text style={styles.cardSub}>Level: {s.level}</Text>
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
