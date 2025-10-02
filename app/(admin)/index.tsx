import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../assets/styles/home.styles";
import TabsHeader from "../../components/AppHeader";
import COLORS from "@/constants/colors";


const StudentHome = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, marginBottom: 16, }}>
      {/* Fixed Header */}
      <TabsHeader />

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        style={{ marginTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Info Card */}
        <View style={localStyles.infoCard}>
          <View style={{ flex: 1 }}>
            <Text style={localStyles.name}>PATRISCO GIVENCE student</Text>
            <Text style={localStyles.program}>NURSING</Text>
            <Text style={localStyles.level}>2024/2025 | 200</Text>
            <Text style={localStyles.matricule}>
              Matricule:{" "}
              <Text style={{ fontStyle: "italic" }}>BU23-NUS-0023</Text>
            </Text>
            <Text style={localStyles.performanceLabel}>Overall performance</Text>
            <View style={localStyles.progressBar}>
              <View style={[localStyles.progress, { width: "70%" }]} />
            </View>
          </View>
          <Image
            source={require("../../assets/images/icon.png")}
            style={localStyles.avatar}
          />
        </View>

        {/* Announcements */}
        <View style={styles.bookCard}>
          <Text style={styles.bookTitle}>📣 Announcements</Text>
          <Text style={styles.caption}>
            📌 Orientation starts Sept 1st. Make sure to check your department schedule.
          </Text>
        </View>

        {/* Upcoming */}
        <View style={styles.bookCard}>
          <Text style={styles.bookTitle}>🗓️ Upcoming</Text>
          <Text style={styles.caption}>📘 Data Structures Quiz – Friday, 10AM</Text>
          <Text style={styles.caption}>📗 Software Eng. Class – Thursday, 2PM</Text>
        </View>

        {/* Quick Action Boxes */}
        <View style={localStyles.gridContainer}>
          {[
            {
              label: "CA",
              route: "/admin/results/ca",
              icon: <Feather name="file-text" size={24} color={COLORS.primary} />,
            },
            {
              label: "Exam",
              route: "/admin/results/exam",
              icon: <MaterialIcons name="edit" size={24} color={COLORS.primary} />,
            },
            {
              label: "Resit",
              route: "/admin/results/resit",
              icon: <Feather name="list" size={24} color={COLORS.primary} />,
            },
            {
              label: "Results",
              route: "results",
              icon: <MaterialIcons name="school" size={24} color={COLORS.primary} />,
            },
            {
              label: "Fees",
              route: "/admin/fee/fees",
              icon: <Feather name="credit-card" size={24} color={COLORS.primary} />,
            },
            {
              label: "Courses",
              route: "courses",
              icon: <Ionicons name="book-outline" size={24} color={COLORS.primary} />,
            },
            {
              label: "Transcript",
              route: "/admin/transcript",
              icon: <MaterialIcons name="description" size={24} color={COLORS.primary} />,
            },
            {
              label: "Complaints",
              route: "/admin/profile/complaint",
              icon: <Ionicons name="alert-circle-outline" size={24} color={COLORS.primary} />,
            },
            {
              label: "More",
              route: "/admin/more",
              icon: <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.primary} />,
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={localStyles.box}
              onPress={() => router.push(item.route as any)}
            >
              {item.icon}
              <Text style={localStyles.boxLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Links */}
        <View style={[styles.bookCard, { paddingVertical: 10 }]}>
          <Text style={styles.bookTitle}>🚀 Quick Links</Text>

          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="book-outline" size={20} color={COLORS.textPrimary} />
            <Text style={[styles.caption, { marginLeft: 10 }]}>View My Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.textPrimary} />
            <Text style={[styles.caption, { marginLeft: 10 }]}>My Timetable</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="bar-chart-outline" size={20} color={COLORS.textPrimary} />
            <Text style={[styles.caption, { marginLeft: 10 }]}>View Results</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentHome;


// Local Styles
const localStyles = StyleSheet.create({
  infoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 16,
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  program: {
    color: "white",
    fontSize: 14,
    marginBottom: 2,
  },
  level: {
    color: "white",
    fontSize: 13,
    marginBottom: 2,
  },
  matricule: {
    color: "white",
    fontSize: 12,
    marginBottom: 10,
  },
  performanceLabel: {
    color: "white",
    fontSize: 12,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#ccc",
    borderRadius: 5,
    width: "90%",
  },
  progress: {
    height: 6,
    backgroundColor: "#00FFAA",
    borderRadius: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  box: {
    width: "47%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  boxLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
  },
});
