// app/student/timetable/index.jsx
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TabsHeader from "../../../components/TabsHeader";
import COLORS from "../../../constants/colors";

const timetableData = {
  Monday: [
    { time: "8:00 - 9:30", course: "Calculus", lecturer: "Dr. Smith", room: "A101" },
    { time: "10:00 - 11:30", course: "English", lecturer: "Ms. Johnson", room: "B203" },
  ],
  Tuesday: [
    { time: "9:00 - 10:30", course: "Physics", lecturer: "Mr. Lee", room: "C201" },
  ],
  // ... add rest of the week
};

const TimetableScreen = () => {
  return (
     <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Fixed Header */}
      <TabsHeader />
     <View style={{ flex: 1, backgroundColor: COLORS.background }}>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 50 }}>
      <Text style={styles.title}>Weekly Timetable</Text>
      {Object.entries(timetableData).map(([day, classes]) => (
        <View key={day} style={styles.daySection}>
          <Text style={styles.dayTitle}>{day}</Text>
          {classes.map((item, index) => (
            <View key={index} style={styles.classCard}>
              <Text style={styles.course}>{item.course}</Text>
              <Text style={styles.details}>
                {item.time} | {item.room} | {item.lecturer}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
    </View>
    </View>
  );
};

export default TimetableScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: COLORS.primary,
    textAlign: "center",
  },
  daySection: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  classCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  course: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  details: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
