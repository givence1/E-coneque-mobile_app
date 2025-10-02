import AppHeader from "@/components/AppHeader";
import { MenuStudent } from "@/components/HomeMenu/MenuStudent";
import { MenuTeacher } from "@/components/HomeMenu/MenuTeacher";
import ProfileHeader from "@/components/ProfileHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const HomePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { section, feesId, user, role } = useAuthStore();

  // ✅ Student fees query
  const { data: dataFees } = useQuery(GET_FEES, {
    variables: { id: feesId },
  });

  // ✅ Teacher user query
  const { data: dataUser } = useQuery(GET_TEACHER_USER, {
    variables: { id: user?.user_id },
  });

  // Determine student fee node or teacher node
  const profileData =
    role === "student"
      ? section === "higher"
        ? dataFees?.allSchoolFees?.edges[0]
        : section === "secondary"
        ? dataFees?.allSchoolFeesSec?.edges[0]
        : section === "primary"
        ? dataFees?.allSchoolFeesPrim?.edges[0]
        : dataFees?.allSchoolFees?.edges[0]
      : dataUser?.allCustomusers?.edges[0]; // teacher node

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showTabs showTitle />

      <ScrollView
        contentContainerStyle={{ paddingTop: 70, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ✅ Profile Card */}
        <ProfileHeader fees={profileData} role={role} />

        {/* Student Quick Action */}
        <View style={localStyles.gridContainer}>
          {(role === "student" || role === "parent") &&
            MenuStudent({ role, section })
              .filter((item: any) => item.display)
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={localStyles.box}
                  onPress={() => router.push(item.route as any)}
                >
                  {item.icon}
                  <Text style={localStyles.boxLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
        </View>

        {/* Teacher Quick Action */}
        <View style={localStyles.gridContainer}>
          {(role === "admin" || role === "teacher") &&
            MenuTeacher({ role, section })
              .filter((item: any) => item.display)
              .map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={localStyles.box}
                  onPress={() => router.push(item.route as any)}
                >
                  {item.icon}
                  <Text style={localStyles.boxLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;

const localStyles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  box: {
    width: "47%",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  boxLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textDark,
  },
});

// 🔹 GraphQL queries
const GET_FEES = gql`
  query GetData($id: ID!) {
    allSchoolFees(id: $id) {
      edges {
        node {
          id
          platformPaid
          customuser {
            matricle
            preinscriptionStudent {
              fullName
            }
          }
          program { name }
          specialty {
            academicYear
            level { level }
            mainSpecialty { specialtyName }
          }
        }
      }
    }
    allSchoolFeesSec(id: $id) {
      edges {
        node {
          id
          platformPaid
          customuser {
            matricle
            preinscriptionStudent { fullName }
          }
          classroomsec {
            level
            academicYear
          }
        }
      }
    }
    allSchoolFeesPrim(id: $id) {
      edges {
        node {
          id
          platformPaid
          customuser {
            matricle
            preinscriptionStudent { fullName }
          }
          classroomprim {
            level
            academicYear
          }
        }
      }
    }
  }
`;

const GET_TEACHER_USER = gql`
  query GetTeacher($id: ID!) {
    allCustomusers(id: $id) {
      edges {
        node {
          id
          matricle
          preinscriptionLecturer {
            fullName
          }
        }
      }
    }
  }
`;
