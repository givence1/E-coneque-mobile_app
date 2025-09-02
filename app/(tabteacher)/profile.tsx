import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useQuery } from "@apollo/client";
import COLORS from "../../constants/colors";
import TabHeader from "../../components/TabsHeader";
import { useAuthStore } from "@/store/authStore"; // ✅ get profileId from auth store

// GraphQL Query
const GET_PROFILE = gql`
  query GetProfile($id: ID!) {
    allUserProfiles(id: $id) {
      edges {
        node {
          id
          program { name }
          specialty {
            academicYear
            level { level }
            mainSpecialty { specialtyName }
          }
          customuser {
            fullName
            email
            telephone
            photo
          }
        }
      }
    }
  }
`;

export default function LecturerProfileScreen() {
  const { profileId } = useAuthStore();

  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { id: profileId },
    skip: !profileId,
  });

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => console.log("Logged out") },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>Failed to load profile</Text>
      </View>
    );
  }

  const profile = data?.allUserProfiles?.edges?.[0]?.node;
  const user = profile?.customuser;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <TabHeader />

      {/* Profile Header */}
      <View style={styles.header}>
        {user?.photo ? (
          <Image source={{ uri: user.photo }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle-outline" size={120} color={COLORS.border} />
        )}
        <Text style={styles.name}>{user?.fullName || "Lecturer"}</Text>
        <Text style={styles.subtext}>{profile?.program?.name}</Text>
        <Text style={styles.subtext}>{user?.email}</Text>
        <Text style={styles.subtext}>{user?.telephone}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginTop: 80, marginBottom: 20 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: "700", color: COLORS.textPrimary },
  subtext: { fontSize: 14, color: COLORS.textSecondary },
  section: { marginTop: 20, paddingHorizontal: 20 },
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
  actionText: { fontSize: 16, color: COLORS.textDark },
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
  logoutText: { marginLeft: 8, color: COLORS.white, fontSize: 16, fontWeight: "600" },
});
