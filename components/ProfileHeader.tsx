import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ProfileHeader = ({ fees, role }: { fees: any; role: string }) => {
  let profile: any = null;

  if (role === "teacher") {
    // ✅ Teacher data from allCustomusers
    profile = {
      matricle: fees?.node?.matricle || "N/A",
      fullName: fees?.node?.preinscriptionLecturer?.fullName || "Teacher",
    };
  } else if (role === "student") {
    // ✅ Student data from allSchoolFees
    profile = {
      matricle: fees?.node?.customuser?.matricle || "N/A",
      fullName: fees?.node?.customuser?.preinscriptionStudent?.fullName || "Student",
      program: fees?.node?.program?.name || fees?.node?.programsec || "",
      level:
        fees?.node?.specialty?.level?.level ||
        fees?.node?.classroomsec?.level ||
        "",
      academicYear:
        fees?.node?.specialty?.academicYear ||
        fees?.node?.classroomsec?.academicYear ||
        "",
    };
  }

  return (
    <View style={styles.profileCard}>
      <Ionicons name="person-circle-outline" size={60} color={COLORS.primary} />
      <View>
        <Text style={styles.profileName}>{profile?.matricle}</Text>
        <Text style={styles.profileSub}>{profile?.fullName}</Text>
        {role === "student" && (
          <>
            <Text style={styles.profileDetail}>
              {profile?.program} • {profile?.level}
            </Text>
            <Text style={styles.profileDetail}>{profile?.academicYear}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
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
  profileSub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  profileDetail: {
    fontSize: 13,
    color: COLORS.textDark,
    marginTop: 2,
  },
});
