import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import TabsHeader from "../../components/TabsHeader";
import { gql, useQuery } from "@apollo/client";
import { useAuthStore } from "@/store/authStore";

// GraphQL query
const GET_LECTURER_COURSES = gql`
  query GetLecturerCourses($lecturerId: Decimal!) {
    lecturerCourses(lecturerId: $lecturerId) {
      edges {
        node {
          id
          courseCode
          mainCourse {
            courseName
          }
          specialty {
            academicYear
          }
          studentsCount
        }
      }
    }
  }
`;

export default function LecturerCoursesScreen() {
  const { profileId } = useAuthStore(); // 👈 assuming profileId is lecturerId

  const { data, loading, error } = useQuery(GET_LECTURER_COURSES, {
    variables: { lecturerId: Number(profileId) },
    skip: !profileId,
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Failed to load courses</Text>
      </View>
    );
  }

  const courses = data?.lecturerCourses?.edges || [];

  return (
    <ScrollView style={styles.container}>
      <TabsHeader />
      <Text style={styles.heading}>📚 My Courses</Text>

      {courses.length === 0 ? (
        <Text style={styles.empty}>No courses assigned.</Text>
      ) : (
        courses.map(({ node }: any) => (
          <View key={node.id} style={styles.courseCard}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>
                {node.mainCourse?.courseName || "Untitled"}
              </Text>
              <Text style={styles.courseCode}>{node.courseCode}</Text>
              <Text style={styles.courseStudents}>
                {node.studentsCount || 0} Students
              </Text>
              <Text style={styles.courseYear}>
                Academic Year {node.specialty?.academicYear}
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
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 30,
    marginBottom: 20,
  },
  empty: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 20,
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
  courseYear: {
    fontSize: 12,
    fontStyle: "italic",
    color: COLORS.textSecondary,
    marginTop: 2,
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
