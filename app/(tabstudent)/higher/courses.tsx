import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import TabsHeader from "@/components/TabsHeader";
import COLORS from "../../../constants/colors";
import { gql, useQuery } from "@apollo/client";
import { useAuthStore } from "@/store/authStore";
import { EdgeCourse } from "@/utils/schemas/interfaceGraphql";


type CourseNode = {
  courseCode: string;
  semester: "I" | "II" | string;
  specialty?: {
    academicYear?: string;
  };
  mainCourse?: {
    courseName?: string;
  };
};

export default function CoursesScreen() {
  const { profileId } = useAuthStore();

  // ⚠️ Replace this with actual specialtyId from profile
  const specialtyId = 1;

  const { data, loading, error } = useQuery(GET_COURSES, {
    variables: { specialtyId: Number(specialtyId) },
    skip: !specialtyId,
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "red" }}>Failed to load courses</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TabsHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>My Courses</Text>

          <View key={data?.allCourses?.edges[0].node?.specialty?.academicYear} style={styles.yearGroup}>
            <Text style={styles.yearTitle}>Academic Year {data?.allCourses?.edges[0].node?.specialty?.academicYear}</Text>
            
            {/* Semester I */}
              <View style={styles.semesterGroup}>
                <Text style={styles.semesterTitle}>Semester I</Text>
                {renderTable(data?.allCourses?.edges.filter((c: EdgeCourse) => c.node.semester === "I"), "I")}
              </View>

            {/* Semester II */}
              <View style={styles.semesterGroup}>
                <Text style={styles.semesterTitle}>Semester II</Text>
                {renderTable(data?.allCourses?.edges.filter((c: EdgeCourse) => c.node.semester === "II"), "II")}
              </View>
          </View>
      </ScrollView>
    </View>
  );
}

function renderTable(courses: EdgeCourse[], semester: string) {
  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>#</Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 6 }]}>
          Course Name
        </Text>
        <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Sem</Text>
      </View>

      {courses.map((course, index) => (
        <View
          key={course.node.id} // ✅ unique key now
          style={[
            styles.row,
            index % 2 === 0 ? styles.rowEven : styles.rowOdd,
          ]}
        >
          <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
          <Text style={[styles.cell, { flex: 6 }]}>{course.node.mainCourse?.courseName}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{course?.node?.semester}</Text>
        </View>
      ))}
    </View>
  );
}


const GET_COURSES = gql`
  query GetStudentCourses(
    $specialtyId: Decimal!
  ) {
    allCourses(
    specialtyId: $specialtyId
  ) {
      edges {
        node {
        id
          courseCode
          semester
          specialty {
            academicYear
          }
          mainCourse {
            courseName
          }
        }
      }
    }
  }
`;

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
  },
  yearGroup: {
    marginBottom: 24,
  },
  yearTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  semesterGroup: {
    marginBottom: 16,
  },
  semesterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  rowEven: {
    backgroundColor: COLORS.background,
  },
  rowOdd: {
    backgroundColor: COLORS.cardBackground,
  },
  cell: {
    paddingHorizontal: 6,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  headerCell: {
    fontWeight: "700",
    fontSize: 16,
    color: COLORS.textDark,
    paddingVertical: 8,
  },
});
