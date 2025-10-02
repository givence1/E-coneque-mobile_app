import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { protocol, RootApi, tenant } from "@/utils/config"; // ✅ import same as lecturer
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function StudentProfileScreen() {
  const { t } = useTranslation();
  const { logout, profileId } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      t("profile.logoutTitle"),
      t("profile.logoutMessage"),
      [
        { text: t("profile.cancel"), style: "cancel" },
        { text: t("profile.yes"), style: "destructive", onPress: () => logout() },
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
        <Text>{t("ui.loading")}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "red" }}>{t("profile.loadError")}</Text>
      </View>
    );
  }

  const profile = data?.allUserProfiles?.edges?.[0]?.node || {};
  const userPhoto = profile?.customuser?.photo?.length > 1
    ? { uri: `${protocol}${tenant}${RootApi}/media/${profile?.customuser?.photo}` }
    : require("@/assets/images/icon.png"); // fallback like lecturer

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTabs showTitle />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingTop: 65, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <Image source={userPhoto} style={styles.avatar} />
          <Text style={styles.name}>{profile?.customuser?.fullName || t("ui.noData")}</Text>
          <Text style={styles.matric}>
            {t("profile.id")}: {profile?.customuser?.matricle || "N/A"}
          </Text>
        </View>

        {/* Personal Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>ℹ️ {t("profile.personalInfo")}</Text>
          <InfoRow label={t("profile.email")} value={profile?.customuser?.email} />
          <InfoRow label={t("profile.phone")} value={profile?.customuser?.telephone} />
          <InfoRow label={t("profile.dob")} value={profile?.customuser?.dob} />
          <InfoRow label={t("profile.pob")} value={profile?.customuser?.pob} />
        </View>

        {/* Parent Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>👨‍👩‍👧 {t("profile.parentInfo")}</Text>
          <InfoRow label={t("profile.fatherName")} value={profile?.customuser?.fatherName} />
          <InfoRow label={t("profile.fatherPhone")} value={profile?.customuser?.fatherTelephone} />
          <InfoRow label={t("profile.motherName")} value={profile?.customuser?.motherName} />
          <InfoRow label={t("profile.motherPhone")} value={profile?.customuser?.motherTelephone} />
          <InfoRow label={t("profile.parentAddress")} value={profile?.customuser?.parentAddress} />
        </View>

        {/* Academic Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>🎓 {t("profile.academicInfo")}</Text>
          <InfoRow label={t("profile.program")} value={profile?.program?.name} />
          <InfoRow label={t("profile.level")} value={profile?.specialty?.level?.level} />
          <InfoRow label={t("profile.department")} value={profile?.specialty?.mainSpecialty?.specialtyName} />
          <InfoRow label={t("profile.yearObtained")} value={profile?.specialty?.academicYear} />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
          <Text style={styles.logoutText}>{t("profile.logout")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue} numberOfLines={3} ellipsizeMode="tail">
      {value || "N/A"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    marginTop: 40,
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
    textAlign: "center",   
    marginBottom: 4,
  },
  matric: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",  
    flexWrap: "wrap",
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
    flexWrap: "wrap",  
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flexShrink: 1,
    maxWidth: "40%",   
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
    flexShrink: 1,
    maxWidth: "60%",   
  },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginTop: 20,
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
            dob
            pob
            fatherName
            fatherTelephone
            motherName
            motherTelephone
            parentAddress
          }
        }
      }
    }
  }
`;
