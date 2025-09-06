import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TabsHeader from "../../components/lecturerHeader/TabsHeader";
import COLORS from "../../constants/colors";

type PortalStatus = {
  ca: boolean;
  exam: boolean;
  resit: boolean;
};

type ClassItem = {
  id: string;
  specialty: string;
  level: string;
  course: string;
  semester: number; // 1 or 2
  portal: PortalStatus;
};

// ✅ Mock data (replace with API)
const teachingClasses: ClassItem[] = [
  {
    id: "1",
    specialty: "Computer Science",
    level: "Level 100",
    course: "Mathematics",
    semester: 2,
    portal: { ca: true, exam: false, resit: false },
  },
  {
    id: "2",
    specialty: "Electronics",
    level: "Level 100",
    course: "Electronics",
    semester: 1,
    portal: { ca: false, exam: true, resit: false },
  },
  {
    id: "3",
    specialty: "Computer Science",
    level: "Level 200",
    course: "Data Structures",
    semester: 2,
    portal: { ca: false, exam: false, resit: true },
  },
];

export default function LecturerPortalScreen() {
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (classItem: ClassItem) => {
    setSelectedClass(classItem);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedClass(null);
  };

  const handleUpload = (type: "ca" | "exam" | "resit") => {
    if (!selectedClass) return;
    closeModal();

    // ✅ Navigate to upload screen with params
    router.push({
      pathname: "/pagesHigher/UploadMarksDetailScreen",
      params: {
        level: selectedClass.level,
        course: selectedClass.course,
        specialty: selectedClass.specialty,
        semester: selectedClass.semester,
        type, // ca, exam, resit
      },
    });
  };

  // ✅ Order: Semester 2 first
  const orderedClasses = [...teachingClasses].sort(
    (a, b) => b.semester - a.semester
  );

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <TabsHeader />

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>📈 Upload Marks</Text>

        {orderedClasses.map((item) => {
          const anyOpen =
            item.portal.ca || item.portal.exam || item.portal.resit;

          return (
            <View key={item.id} style={styles.card}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <Ionicons name="book-outline" size={22} color={COLORS.primary} />
                <View>
                  <Text style={styles.cardTitle}>{item.course}</Text>
                  <Text style={styles.cardSubtitle}>
                    {item.specialty} • {item.level} • Semester {item.semester}
                  </Text>
                </View>
              </View>

              {/* Portal status */}
              <View style={styles.statusRow}>
                <Ionicons
                  name={item.portal.ca ? "checkmark-circle" : "close-circle"}
                  size={18}
                  color={item.portal.ca ? "green" : "red"}
                />
                <Text style={styles.statusText}>CA Portal</Text>
              </View>
              <View style={styles.statusRow}>
                <Ionicons
                  name={item.portal.exam ? "checkmark-circle" : "close-circle"}
                  size={18}
                  color={item.portal.exam ? "green" : "red"}
                />
                <Text style={styles.statusText}>Exam Portal</Text>
              </View>
              <View style={styles.statusRow}>
                <Ionicons
                  name={item.portal.resit ? "checkmark-circle" : "close-circle"}
                  size={18}
                  color={item.portal.resit ? "green" : "red"}
                />
                <Text style={styles.statusText}>Resit Portal</Text>
              </View>

              {/* Upload button */}
              <TouchableOpacity
                style={[
                  styles.btn,
                  { backgroundColor: anyOpen ? COLORS.primary : COLORS.border },
                ]}
                disabled={!anyOpen}
                onPress={() => openModal(item)}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={18}
                  color={anyOpen ? "#fff" : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.btnText,
                    { color: anyOpen ? "#fff" : COLORS.textSecondary },
                  ]}
                >
                  Upload Marks
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* ✅ Modal Popup */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close button */}
            <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
              <Ionicons name="close" size={22} color={COLORS.textDark} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              Choose Upload Type for {selectedClass?.course}
            </Text>

            {selectedClass?.portal.ca && (
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => handleUpload("ca")}
              >
                <Text style={styles.modalBtnText}>Upload CA</Text>
              </TouchableOpacity>
            )}
            {selectedClass?.portal.exam && (
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => handleUpload("exam")}
              >
                <Text style={styles.modalBtnText}>Upload Exam</Text>
              </TouchableOpacity>
            )}
            {selectedClass?.portal.resit && (
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => handleUpload("resit")}
              >
                <Text style={styles.modalBtnText}>Upload Resit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 90, // space for TabsHeader
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalClose: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
