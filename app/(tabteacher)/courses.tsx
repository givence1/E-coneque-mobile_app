import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TabsHeader from "../../components/lecturerHeader/TabsHeader";
import COLORS from "../../constants/colors";

interface Course {
  id: string;
  title: string;
  specialty: string;
  level: string;
  semester: string;
}

const dummyCourses: Course[] = [
  {
    id: "1",
    title: "Computer Networks",
    specialty: "Computer Science",
    level: "Level 300",
    semester: "First Semester",
  },
  {
    id: "2",
    title: "Operating Systems",
    specialty: "Computer Science",
    level: "Level 200",
    semester: "Second Semester",
  },
];

export default function LecturerCoursesScreen() {
  const router = useRouter();
  const [outlineModal, setOutlineModal] = useState(false);
  const [outlineText, setOutlineText] = useState("");

  const handleSubmitOutline = () => {
    console.log("Submitted Outline:", outlineText);
    setOutlineModal(false);
    setOutlineText("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TabsHeader />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 20 }}
      >
        <Text style={styles.heading}>📚 My Courses</Text>

        {dummyCourses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseMeta}>
                Specialty: {course.specialty}
              </Text>
              <Text style={styles.courseMeta}>Class: {course.level}</Text>
              <Text style={styles.courseMeta}>Semester: {course.semester}</Text>
            </View>

            <View style={styles.actions}>
              {/* Course Outline */}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setOutlineModal(true)}
              >
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={styles.actionText}>Course Outline</Text>
              </TouchableOpacity>

              {/* Questions */}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push("/pagesHigher/lecturersComponents/question")}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={styles.actionText}>Questions</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Course Outline Modal */}
      <Modal transparent visible={outlineModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Course Outline</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Type course outline..."
              value={outlineText}
              onChangeText={setOutlineText}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { flex: 1 }]}
                onPress={handleSubmitOutline}
              >
                <Text style={styles.actionText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { flex: 1 }]}
                onPress={() => setOutlineModal(false)}
              >
                <Text style={[styles.actionText, { color: "red" }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
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
  courseMeta: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
    color: COLORS.textPrimary,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
});
