import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TabsHeader from "../../../components/lecturerHeader/TabsHeader";
import COLORS from "../../../constants/colors";

export default function ResitsScreen() {
  const resits = [
    { id: "1", course: "Mathematics", semester: "1", count: 12 },
    { id: "2", course: "Electronics", semester: "2", count: 8 },
  ];

  return (
    <View style={styles.container}>
      <TabsHeader title="Resits" />
      <ScrollView
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 30, paddingHorizontal: 16 }}
      >
        {resits.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.cardTitle}>{r.course}</Text>
            <Text style={styles.cardSub}>Semester {r.semester}</Text>
            <Text style={styles.cardSub}>{r.count} students</Text>
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
