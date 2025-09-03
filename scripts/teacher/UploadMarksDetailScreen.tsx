import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import COLORS from "../../constants/colors";
import Header from "../../components/Header";

type Student = {
  id: string;
  name: string;
  ca1: number | null;
  exam1: number | null;
  resit1: number | null;
  ca2: number | null;
  exam2: number | null;
  resit2: number | null;
};

export default function UploadMarksDetailScreen() {
  const { level = "", course = "" } = useLocalSearchParams<{
    level: string;
    course: string;
  }>();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalOpen, setPortalOpen] = useState(false);

  useEffect(() => {
    const fetchMockData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPortalOpen(true);

      setStudents([
        {
          id: "1",
          name: "Alice",
          ca1: 20,
          exam1: 55,
          resit1: null,
          ca2: 18,
          exam2: 62,
          resit2: null,
        },
        {
          id: "2",
          name: "zane",
          ca1: 15,
          exam1: 53,
          resit1: null,
          ca2: 20,
          exam2: 52,
          resit2: null,
        },
        {
          id: "3",
          name: "Cynthia",
          ca1: 25,
          exam1: 60,
          resit1: null,
          ca2: 20,
          exam2: 70,
          resit2: null,
        },
        {
          id: "4",
          name: "Patrisco",
          ca1: null,
          exam1: null,
          resit1: null,
          ca2: null,
          exam2: null,
          resit2: null,
        },
      ]);

      setLoading(false);
    };

    fetchMockData();
  }, [level, course]);

  const updateMark = (
    id: string,
    field: keyof Student,
    value: string
  ) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, [field]: Number(value) || null } : student
      )
    );
  };

  const handleSubmitSemester = (semester: 1 | 2) => {
    const payload = students.map((student) => {
      const ca = semester === 1 ? student.ca1 : student.ca2;
      const exam = semester === 1 ? student.exam1 : student.exam2;
      const resit = semester === 1 ? student.resit1 : student.resit2;
      return {
        id: student.id,
        name: student.name,
        CA: ca,
        Exam: exam,
        Resit: resit,
        Total: (ca || 0) + (exam || 0),
        Average: ((ca || 0) + (exam || 0)) / 2,
      };
    });

    Alert.alert("Success", `Semester ${semester} marks submitted.`);
    console.log(`Submitted Semester ${semester} Data:`, payload);
  };

  const calculateTotal = (ca: number | null, exam: number | null) =>
    (ca || 0) + (exam || 0);

  const calculateAverage = (ca: number | null, exam: number | null) => {
    const total = calculateTotal(ca, exam);
    return total / 2;
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
     <View style={styles.container}>
      
          <Header />
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        Upload Marks for {course} (Level {level})
      </Text>

      {/* 1st Semester */}
      <Text style={styles.subHeader}>1st Semester</Text>
      {students.map((student) => (
        <View style={styles.card} key={`${student.id}-1`}>
          <Text style={styles.name}>{student.name}</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, !portalOpen && styles.disabled]}
              value={student.ca1?.toString() || ""}
              placeholder="CA"
              keyboardType="numeric"
              onChangeText={(val) => updateMark(student.id, "ca1", val)}
              editable={portalOpen}
            />
            <TextInput
              style={[styles.input, !portalOpen && styles.disabled]}
              value={student.exam1?.toString() || ""}
              placeholder="Exam"
              keyboardType="numeric"
              onChangeText={(val) => updateMark(student.id, "exam1", val)}
              editable={portalOpen}
            />
            <TextInput
              style={[styles.input, !portalOpen && styles.disabled]}
              value={student.resit1?.toString() || ""}
              placeholder="Resit"
              keyboardType="numeric"
              onChangeText={(val) => updateMark(student.id, "resit1", val)}
              editable={portalOpen}
            />
          </View>
          <View style={styles.resultRow}>
            <Text>Total: {calculateTotal(student.ca1, student.exam1)}</Text>
            <Text>Avg: {calculateAverage(student.ca1, student.exam1).toFixed(1)}</Text>
          </View>
        </View>
      ))}

      {portalOpen && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSubmitSemester(1)}
        >
          <Text style={styles.buttonText}>Submit Semester 1</Text>
        </TouchableOpacity>
      )}

      {/* 2nd Semester */}
      <Text style={styles.subHeader}>2nd Semester</Text>
      {students.map((student) => (
        <View style={styles.card} key={`${student.id}-2`}>
          <Text style={styles.name}>{student.name}</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, !portalOpen && styles.disabled]}
              value={student.ca2?.toString() || ""}
              placeholder="CA"
              keyboardType="numeric"
              onChangeText={(val) => updateMark(student.id, "ca2", val)}
              editable={portalOpen}
            />
            <TextInput
              style={[styles.input, !portalOpen && styles.disabled]}
              value={student.exam2?.toString() || ""}
              placeholder="Exam"
              keyboardType="numeric"
              onChangeText={(val) => updateMark(student.id, "exam2", val)}
              editable={portalOpen}
            />
            <TextInput
              style={[styles.input, !portalOpen && styles.disabled]}
              value={student.resit2?.toString() || ""}
              placeholder="Resit"
              keyboardType="numeric"
              onChangeText={(val) => updateMark(student.id, "resit2", val)}
              editable={portalOpen}
            />
          </View>
          <View style={styles.resultRow}>
            <Text>Total: {calculateTotal(student.ca2, student.exam2)}</Text>
            <Text>Avg: {calculateAverage(student.ca2, student.exam2).toFixed(1)}</Text>
          </View>
        </View>
      ))}

      {portalOpen && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSubmitSemester(2)}
        >
          <Text style={styles.buttonText}>Submit Semester 2</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: COLORS.background,
    paddingBottom: 40,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    marginBottom: 6,
  },
  inputGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  disabled: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});