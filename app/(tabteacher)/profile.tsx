import React, { JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import TabHeader from "../../components/TabsHeader"; // adjust path if needed

export default function LecturerProfileScreen(): JSX.Element {
  const handleLogout = (): void => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => console.log("Logged out") },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Tab Header */}
      <TabHeader />

      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/120" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Dr. Patrisco Givence</Text>
        <Text style={styles.subtext}>Department: Computer Science</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="create-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
          <Text style={styles.actionText}>View Attendance</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Style types
const styles = StyleSheet.create<{
  container: ViewStyle;
  header: ViewStyle;
  avatar: ImageStyle;
  name: TextStyle;
  subtext: TextStyle;
  section: ViewStyle;
  actionBtn: ViewStyle;
  actionText: TextStyle;
  logoutBtn: ViewStyle;
  logoutText: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: "center",
    marginTop: 80,
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
    paddingHorizontal: 20,
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
