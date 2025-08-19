import React, { JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import TabsHeader from "../../components/TabsHeader";

export default function LecturerHomeScreen(): JSX.Element {
  return (
    <View style={styles.container}>
  
      <TabsHeader />

     
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Section */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome back,</Text>
          <Text style={styles.name}>Mr. Patrisco</Text>
        </View>

        {/* Announcements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📢 Announcements</Text>
          <View style={styles.announcementCard}>
            <Text style={styles.announcementText}>
              The quiz portal will close on Friday at 5 PM. Ensure all marks are uploaded before then.
            </Text>
          </View>
        </View>

        {/* Student Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Student Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="people-outline" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>120</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.success} />
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="trending-up-outline" size={24} color={COLORS.warning} />
              <Text style={styles.statValue}>72%</Text>
              <Text style={styles.statLabel}>Avg. Grade</Text>
            </View>
          </View>
        </View>

        {/* Lecturer Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Lecturer Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <FontAwesome5 name="chalkboard-teacher" size={24} color={COLORS.info} />
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statBox}>
              <MaterialIcons name="class" size={24} color={COLORS.warning} />
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="book-outline" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Subjects</Text>
            </View>
          </View>
        </View>

        {/* Resits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎓 Resits</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.error} />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Resits (Sem 1)</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.error} />
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Resits (Sem 2)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  scrollContent: ViewStyle;
  header: ViewStyle;
  welcome: TextStyle;
  name: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  announcementCard: ViewStyle;
  announcementText: TextStyle;
  statsRow: ViewStyle;
  statBox: ViewStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  announcementCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 1,
  },
  announcementText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});