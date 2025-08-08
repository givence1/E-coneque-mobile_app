import React from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../constants/colors";
import TabsHeader from "../../components/TabsHeader";

type ClassItem = {
  id: string;
  level: string;
  course: string;
};

const teachingClasses: ClassItem[] = [
  { id: "1", level: "Level 100", course: "Mathematics" },
  { id: "2", level: "Level 100", course: "Electronics" },
  { id: "3", level: "Level 200", course: "Mathematics" },
  { id: "4", level: "Level 200", course: "Electronics" },
];

export default function LecturerPortalScreen() {
  const navigation = useNavigation();

  const handleUploadPress = (classItem: ClassItem) => {
    router.push({
      pathname: "/teacher/UploadMarksDetailScreen",
      params: {
        level: classItem.level,
        course: classItem.course,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* ✅ Fixed tab header */}
      <TabsHeader />

      {/* ✅ Scrollable content below the header */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>📈 Upload Marks</Text>

        {teachingClasses.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="book-outline" size={22} color={COLORS.primary} />
              <View>
                <Text style={styles.cardTitle}>{item.level}</Text>
                <Text style={styles.cardSubtitle}>{item.course}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleUploadPress(item)}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.btnText}>Upload Marks</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
    paddingTop: 90, // Space below the fixed TabsHeader
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
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
});