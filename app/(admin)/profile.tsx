import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import COLORS from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import TabsHeader from "../../components/TabsHeader";
import { useAuthStore } from "@/store/authStore";


export default function StudentProfileScreen() {
    const { logout } = useAuthStore();
  
  const router = useRouter();

  const handleLogout = () => {
    const confirmed = confirm("Are you sure you want to logout?");
    if (confirmed) logout();
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Fixed Header */}
      <TabsHeader />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/120" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>Patrisco Givence</Text>
          <Text style={styles.subtext}>Matric: ICT20230001</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push("/student/profile/edit")}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push("/student/profile/attendance")}
          >
            <Ionicons name="clipboard-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>View Attendance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push("/student/profile/complaint")}
          >
            <Ionicons name="chatbox-ellipses-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Submit Complaint</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push("/student/profile/ComplaintHistory")}
          >
            <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
            <Text style={styles.actionText}>Complaint History</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    marginTop: 20,
  },
  actionBtn: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginTop: 40,
    marginHorizontal: 60,
    padding: 12,
    borderRadius: 30,
  },
  logoutText: {
    marginLeft: 8,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
