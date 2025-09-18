import COLORS from '@/constants/colors';
import { protocol, RootApi, tenant } from '@/utils/config';
import { EdgeSchoolFees } from '@/utils/schemas/interfaceGraphql';
import { EdgeSchoolFeesPrim } from '@/utils/schemas/interfaceGraphqlPrimary';
import { EdgeSchoolFeesSec } from '@/utils/schemas/interfaceGraphqlSecondary';
import React from 'react';
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from 'react-native';

const ProfileHeader = (
  { fees }: { fees: EdgeSchoolFees | EdgeSchoolFeesSec | EdgeSchoolFeesPrim }
) => {
  const { t } = useTranslation();

  if (!fees) {
    return (
      <View>
        <Text>{t("profileHeader.noFees")}</Text>
      </View>
    );
  }

  let profile: any;
  if ("userprofile" in fees?.node) {
    profile = fees.node.userprofile;
  } else if ("userprofilesec" in fees.node) {
    profile = fees.node.userprofilesec;
  } else if ("userprofileprim" in fees.node) {
    profile = fees.node.userprofileprim;
  }

  // ✅ Build correct photo URL or fallback
  const userPhoto =
    profile?.customuser?.photo && profile?.customuser?.photo.length > 1
      ? { uri: `${protocol}${tenant}${RootApi}/media/${profile?.customuser?.photo}` }
      : {
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile?.customuser?.fullName || profile?.customuser?.username || "User"
          )}&background=random&color=fff`,
        };

  return (
    <View style={localStyles.infoCard}>
      {/* Left side: Text info */}
      <View style={{ flex: 1 }}>
        <Text style={localStyles.name}>{profile?.customuser?.fullName}</Text>
        <Text style={localStyles.program}>
          {profile?.specialty?.mainSpecialty?.specialtyName ||
            profile?.classroomsec?.level ||
            profile?.classroomprim?.level}
        </Text>
        <Text style={localStyles.level}>
          {profile?.specialty?.academicYear ||
            profile?.classroomsec?.academicYear ||
            profile?.classroomprim?.academicYear}{" "}
          |{" "}
          {profile?.specialty?.level?.level ||
            profile?.classroomsec?.level ||
            profile?.classroomprim?.level}
        </Text>
        <Text style={localStyles.matricule}>
          {t("profileHeader.matricule")}:{" "}
          <Text style={{ fontStyle: "italic" }}>
            {profile?.customuser?.matricle}
          </Text>
        </Text>
        <Text style={localStyles.performanceLabel}>
          {t("profileHeader.performance")}
        </Text>
        <View style={localStyles.progressBar}>
          <View style={[localStyles.progress, { width: "70%" }]} />
        </View>
      </View>

      {/* Right side: Avatar */}
      <Image source={userPhoto} style={localStyles.avatar} />
    </View>
  );
};

export default ProfileHeader;

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
    flexWrap: "wrap",
  },
  program: {
    color: "white",
    fontSize: 14,
    marginBottom: 2,
    flexWrap: "wrap",
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
});