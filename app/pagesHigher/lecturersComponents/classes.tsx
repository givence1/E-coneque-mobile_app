import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TabsHeader from "../../../components/lecturerHeader/TabsHeader";
import COLORS from "../../../constants/colors";

export default function ClassesScreen() {
  const classes = [
    { id: "1", name: "Level 100 Mathematics" },
    { id: "2", name: "Level 200 Electronics" },
  ];

  return (
    <View style={styles.container}>
      <TabsHeader title="Classes" />
      <ScrollView
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 30, paddingHorizontal: 16 }}
      >
        {classes.map((c) => (
          <View key={c.id} style={styles.card}>
            <Text style={styles.cardTitle}>{c.name}</Text>
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
});
