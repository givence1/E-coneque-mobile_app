import React, { JSX } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import COLORS from "../../constants/colors";

type AcademicYear = {
  id: string;
  year: string;
  level: string;
  program: string;
  department: string;
};

const academicYears: AcademicYear[] = [
  { id: "1", year: "2024/2025", level: "200", program: "HND", department: "NURSING" },
  { id: "2", year: "2023/2024", level: "100", program: "HND", department: "NURSING" },
];

export default function SelectYearScreen(): JSX.Element {
  const router = useRouter();

  const handleSelect = (item: AcademicYear): void => {
    router.replace({
      pathname: "/(tabstudent)/higher/index",
      params: { year: item.year, level: item.level },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Academic Year</Text>

      <FlatList
        data={academicYears}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
            <Text style={styles.title}>
              <Ionicons name="school-outline" size={16} /> {item.department}
            </Text>
            <Text style={styles.text}>
              <Ionicons name="calendar-outline" size={16} /> Academic Year: {item.year}
            </Text>
            <Text style={styles.text}>
              <Ionicons name="layers-outline" size={16} /> Level: {item.level}
            </Text>
            <Text style={styles.text}>
              <MaterialCommunityIcons name="book-outline" size={16} /> Program: {item.program}
              <Text style={{ color: "green", fontWeight: "bold" }}>   ✔ Active</Text>
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingVertical: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  header: TextStyle;
  card: ViewStyle;
  title: TextStyle;
  text: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#E3F0FF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
});
