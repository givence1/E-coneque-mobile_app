import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator, Alert, Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native"; // 👈 import Alert
import TabsHeader from "../../../components/TabsHeader";
import COLORS from "../../../constants/colors";

export default function StudentProfileScreen() {
  const { logout, profileId } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      { text: "Cancel", style: "cancel" },
      { text: "Yes, Logout", style: "destructive", onPress: () => logout() },
    ]
  );
};

  // Fetch student profile from backend
  const { data, loading, error } = useQuery(GET_PROFILE, {
    variables: { id: profileId },
    skip: !profileId,
  });

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

  const profile = data?.allUserProfiles?.edges?.[0]?.node || {};

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Fixed Header */}
      <TabsHeader />

      {/* Scrollable Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 80, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <Image
            source={{ uri: profile?.customuser?.photo || "https://via.placeholder.com/120" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{profile?.customuser?.fullName || "Not Available"}</Text>
          <Text style={styles.matric}>Matric: {profile?.customuser?.matricle}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>📞 Contact Info</Text>
          <InfoRow label="Email" value={profile?.customuser?.email} />
          <InfoRow label="Phone" value={profile?.customuser?.telephone} />
        </View>

        {/* Parent Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>👨‍👩‍👧 Parent / Guardian Info</Text>
          <InfoRow label="Father" value={profile?.customuser?.fatherName} />
          <InfoRow label="Father Tel" value={profile?.customuser?.fatherTelephone} />
          <InfoRow label="Mother" value={profile?.customuser?.motherName} />
          <InfoRow label="Mother Tel" value={profile?.customuser?.motherTelephone} />
        </View>

        {/* Academic Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>🎓 Academic Info</Text>
          <InfoRow label="Program" value={profile?.program?.name} />
          <InfoRow label="Level" value={profile?.specialty?.level?.level} />
          <InfoRow label="Department" value={profile?.specialty?.mainSpecialty?.specialtyName} />
          <InfoRow label="Year" value={profile?.specialty?.academicYear} />
        </View>

        {/* Action Buttons (2-column grid) */}
        <View style={styles.actionsGrid}>
          <ActionButton
            icon="create-outline"
            label="Edit Profile"
            onPress={() => router.push("../../pagesHigher/profile/edit")}
          />
          <ActionButton
            icon="clipboard-outline"
            label="Attendance"
            onPress={() => router.push("../../pagesHigher/profile/attendance")}
          />
          <ActionButton
            icon="chatbox-ellipses-outline"
            label="Complaint"
            onPress={() => router.push("../../pagesHigher/profile/complaint")}
          />
          <ActionButton
            icon="document-text-outline"
            label="History"
            onPress={() => router.push("../../pagesHigher/profile/ComplaintHistory")}
          />
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

/* ✅ Reusable Row Component */
const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value || "N/A"}</Text>
  </View>
);

/* ✅ Reusable Action Button */
const ActionButton = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <Ionicons name={icon} size={22} color={COLORS.primary} />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
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
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  matric: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
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
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  actionBtn: {
    width: "48%",
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginTop: 20,
    marginHorizontal: 40,
    padding: 14,
    borderRadius: 30,
  },
  logoutText: {
    marginLeft: 8,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

// GraphQL query
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
            matricle
            email
            telephone
            photo
            fatherName
            fatherTelephone
            motherName
            motherTelephone
          }
        }
      }
    }
  }
`;
