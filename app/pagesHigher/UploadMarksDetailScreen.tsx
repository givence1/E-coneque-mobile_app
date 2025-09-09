import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TabsHeader from "../../components/AppHeader";
import COLORS from "../../constants/colors";

//  Mock student data (replace with API later)
type Student = {
  id: string;
  fullName: string;
  mark?: string;
};

const mockStudents: Student[] = [
  { id: "1", fullName: "FORSAH NJUKANG PATRISCO" },
  { id: "2", fullName: " mr lesly" },
  { id: "3", fullName: " CLIFORT  AWUNGANYI" },
  { id: "4", fullName: "Loic" },
];

export default function UploadMarksDetailScreen() {
  const { course, type } = useLocalSearchParams(); // params passed from portal
  const [students, setStudents] = useState<Student[]>(mockStudents);

  const handleMarkChange = (id: string, value: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, mark: value } : s))
    );
  };

  const handleSubmit = () => {
    const filled = students.filter((s) => s.mark?.trim() !== "");
    if (filled.length === 0) {
      Alert.alert("Error", "Please enter at least one mark before submitting.");
      return;
    }
    // ✅ Replace with API call
    console.log("Submitted Marks:", students);
    Alert.alert("Success", "Marks uploaded successfully!");
  };

  return (
    <View style={styles.container}>
      <TabsHeader title={course as string} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 2 }]}> Students Name</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Marks</Text>
        </View>

        {/* Table Rows */}
        {students.map((student, index) => (
          <View
            key={student.id}
            style={[
              styles.tableRow,
              index % 2 === 0 && { backgroundColor: "#f9f9f9" },
            ]}
          >
            <Text style={[styles.cell, { flex: 2 }]}>{student.fullName}</Text>
            <TextInput
              style={[styles.cellInput, { flex: 1 }]}
              placeholder="-"
              keyboardType="numeric"
              value={student.mark || ""}
              onChangeText={(value) => handleMarkChange(student.id, value)}
            />
          </View>
        ))}
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Marks</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 90, // space for TabsHeader
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cell: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  cellInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 13,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  submitBtn: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
