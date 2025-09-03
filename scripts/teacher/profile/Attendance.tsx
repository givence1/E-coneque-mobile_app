import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";

// Type Definitions
type AttendanceRecord = {
  id: string;
  name: string;
  present: boolean;
};

const dummyCourses: string[] = ["ICT 101", "MTH 202", "PHY 110"];

const dummyAttendance: AttendanceRecord[] = [
  { id: "1", name: "Student A", present: true },
  { id: "2", name: "Student B", present: false },
  { id: "3", name: "Student C", present: true },
  { id: "4", name: "Student D", present: false },
];

export default function LecturerAttendanceScreen(): JSX.Element {
  const [selectedCourse, setSelectedCourse] = useState<string>(dummyCourses[0]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>View Attendance</Text>

      <Text style={styles.label}>Select Course:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseRow}>
        {dummyCourses.map((course) => (
          <TouchableOpacity
            key={course}
            style={[
              styles.courseButton,
              selectedCourse === course && styles.selectedCourseButton,
            ]}
            onPress={() => setSelectedCourse(course)}
          >
            <Text
              style={[
                styles.courseButtonText,
                selectedCourse === course && styles.selectedCourseButtonText,
              ]}
            >
              {course}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Student List</Text>

      <FlatList
        data={dummyAttendance}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.studentRow}>
            <Text style={styles.studentName}>{item.name}</Text>
            <View style={styles.status}>
              <Ionicons
                name={item.present ? "checkmark-circle" : "close-circle"}
                size={22}
                color={item.present ? "green" : "red"}
              />
              <Text style={{ color: item.present ? "green" : "red", marginLeft: 5 }}>
                {item.present ? "Present" : "Absent"}
              </Text>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

// Style definitions with inferred types
const styles = StyleSheet.create<{
  container: ViewStyle;
  title: TextStyle;
  label: TextStyle;
  courseRow: ViewStyle;
  courseButton: ViewStyle;
  selectedCourseButton: ViewStyle;
  courseButtonText: TextStyle;
  selectedCourseButtonText: TextStyle;
  sectionTitle: TextStyle;
  studentRow: ViewStyle;
  studentName: TextStyle;
  status: ViewStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.textPrimary,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  courseRow: {
    marginBottom: 20,
    flexDirection: "row",
  },
  courseButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedCourseButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  courseButtonText: {
    color: COLORS.textDark,
    fontSize: 14,
  },
  selectedCourseButtonText: {
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.cardBackground,
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  studentName: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
  },
});
