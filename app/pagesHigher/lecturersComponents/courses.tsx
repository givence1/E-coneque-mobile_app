import { Ionicons } from "@expo/vector-icons";
import React, { JSX } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import TabsHeader from "../../../components/lecturerHeader/TabsHeader";
import COLORS from "../../../constants/colors";

// Define the type for a course
interface Course {
  id: string;
  title: string;
  code: string;
  students: number;
}

// Dummy data typed with the Course interface
const dummyCourses: Course[] = [
  {
    id: "1",
    title: "Computer Networks",
    code: "CS301",
    students: 45,
  },
  {
    id: "2",
    title: "Operating Systems",
    code: "CS204",
    students: 39,
  },
];

export default function LecturerCoursesScreen(): JSX.Element {
  return (
    <ScrollView
      style={styles.container}
    >
      <TabsHeader /> 

      <Text style={styles.heading}>📚 My Courses</Text>

      {dummyCourses.map((course) => (
        <View key={course.id} style={styles.courseCard}>
          <View style={styles.courseInfo}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseCode}>{course.code}</Text>
            <Text style={styles.courseStudents}>
              {course.students} Students
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.actionText}>Notes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons
                name="videocam-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.actionText}>Videos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons
                name="clipboard-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.actionText}>Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// Define styles with explicit typing for TypeScript
const styles = StyleSheet.create<{
  container: ViewStyle;
  heading: TextStyle;
  courseCard: ViewStyle;
  courseInfo: ViewStyle;
  courseTitle: TextStyle;
  courseCode: TextStyle;
  courseStudents: TextStyle;
  actions: ViewStyle;
  actionBtn: ViewStyle;
  actionText: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 30,
    marginBottom: 20,
  },
  courseCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    marginBottom: 15,
  },
  courseInfo: {
    marginBottom: 10,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  courseCode: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  courseStudents: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
});
