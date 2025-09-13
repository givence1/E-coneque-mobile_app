import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { protocol, RootApi, tenant } from "@/utils/config";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LecturerProfileScreen() {
  const { logout, profileId, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: () => logout() },
    ]);
  };

  // Fetch lecturer profile
  const { data, loading, error } = useQuery(GET_LECTURER_PROFILE, {
    variables: { customuserId: user?.user_id },
    skip: !user,
  });
  console.log(data);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "red" }}>Failed to load profile</Text>
      </View>
    );
  }

  const profile = data?.allLecturerProfiles?.edges?.[0]?.node || {};
  console.log(profile?.customuser?.photo?.length ? `${protocol}${tenant}${RootApi}/media/` + profile?.customuser?.photo : require("../../assets/images/icon.jpg") );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <AppHeader showBack showTabs showTitle />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 50, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <Image
            source={`${profile?.customuser?.photo?.length > 1 ? protocol + tenant + RootApi + "/media/" + profile?.customuser?.photo : ""}` || require("../../assets/images/icon.jpg")}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile?.customuser?.fullName || "Not Available"}</Text>
          <Text style={styles.matric}>ID: {profile?.customuser?.matricle || "N/A"}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>📞 Contact Info</Text>
          <InfoRow label="Email" value={profile?.customuser?.email} />
          <InfoRow label="Phone" value={profile?.customuser?.telephone} />
          <InfoRow label="Date of Birth" value={profile?.customuser?.dob} />
          <InfoRow label="Place of Birth" value={profile?.customuser?.pob} />
        </View>

        {/* Academic Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>🎓 Academic Info</Text>
          <InfoRow label="Department" value={profile?.department?.domainName} />
          <InfoRow label="Specialty" value={profile?.specialty?.specialtyName} />
          <InfoRow label="Highest Certificate" value={profile?.customuser?.highestCertificate} />
          <InfoRow label="Year Obtained" value={profile?.customuser?.yearObtained} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* 🔹 Reusable Row */
const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value || "N/A"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  headerCard: {
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  name: { fontSize: 20, fontWeight: "700", color: COLORS.textPrimary },
  matric: { fontSize: 14, color: COLORS.textSecondary },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoLabel: { fontSize: 14, color: COLORS.textSecondary },
  infoValue: { fontSize: 14, fontWeight: "500", color: COLORS.textPrimary },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginTop: 20,
    padding: 14,
    borderRadius: 30,
  },
  logoutText: { marginLeft: 8, color: COLORS.white, fontSize: 16, fontWeight: "600" },
});


/* ✅ Correct Lecturer Query */
const GET_LECTURER_PROFILE = gql`
  query GetLecturerProfile(
    $customuserId: Decimal!
  ) {
    allLecturerProfiles(
      customuserId: $customuserId
    ) {
      edges {
        node {
          id
          department { domainName }
          specialty { specialtyName }
          customuser {
            fullName
            matricle
            email
            telephone
            photo
            dob
            pob
            highestCertificate
            yearObtained
          }
        }
      }
    }
  }
`;