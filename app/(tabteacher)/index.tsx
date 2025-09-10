import AppHeader from "@/components/AppHeader";
import DashHigher from "@/components/CompLecturer/DashHigher";
import DashPrimary from "@/components/CompLecturer/DashPrimary";
import DashSecondary from "@/components/CompLecturer/DashSecondary";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";



export default function LecturerHomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const sp = useRoute()
  const { schoolId, schoolType } = sp?.params

  console.log(schoolType);

  return (
    <View style={styles.container}>
      <AppHeader showTabs showTitle />

      <ScrollView
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Lecturer Info */}
        <View style={styles.profileCard}>
          <Ionicons name="person-circle-outline" size={60} color={COLORS.primary} />
          <View>
            <Text style={styles.profileName}>{user?.matricle}</Text>
            <Text style={styles.profileSub}>{user?.full_name}</Text>
          </View>
        </View>

        {/* ✅ Announcements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📢 Announcements</Text>
          <TouchableOpacity
            style={styles.announcementCard}
            onPress={() => router.push("/(tabteacher)/announcements")}
          >
            <Text style={styles.announcementText}>
              The quiz portal will close on Friday at 5 PM. Ensure all marks are
              uploaded before then.
            </Text>
          </TouchableOpacity>
        </View>

        {schoolType === "Section-H" ? <DashHigher /> : null}
        {schoolType === "Section-S" ? <DashSecondary /> : null}
        {schoolType === "Section-P" ? <DashPrimary /> : null}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  profileSub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  section: { marginTop: 20, paddingHorizontal: 16 },
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
  announcementText: { fontSize: 14, color: COLORS.textDark },
  statsRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});