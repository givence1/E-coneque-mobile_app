import AppHeader from "@/components/AppHeader";
import { MenuStudent } from "@/components/HomeMenu/MenuStudent";
import ProfileHeader from "@/components/ProfileHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MenuTeacher } from "./HomeMenu/MenuTeacher";

// 👇 Optional: you can replace this mock data later with real API/GraphQL or Expo push notifications
const useAppNotifications = () => {
  const [notifications, setNotifications] = useState({
    material: false,
    announcement: false,
    complaint: false,
    timetable: false,
  });

  useEffect(() => {
    // Simulate new notifications coming from backend
    // Replace this logic with API call or subscription
    const timer = setTimeout(() => {
      setNotifications({
        material: true,
        announcement: true,
        complaint: false,
        timetable: true,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return notifications;
};

const HomePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { section, feesId, user, role } = useAuthStore();

  // 👇 Notifications
  const newNotifications = useAppNotifications();

  const { data: dataFees, loading, error } = useQuery(GET_FEES, {
    variables: { id: feesId },
  });

  const { data: dataUser } = useQuery(GET_LECTURER_USER, {
    variables: { id: user?.user_id },
  });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showTabs showTitle />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 70,
          paddingBottom: 2,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Lecturer / Student Info Card */}
        <ProfileHeader
          fees={
            section === "higher"
              ? dataFees?.allSchoolFees?.edges[0]
              : section === "secondary"
              ? dataFees?.allSchoolFeesSec?.edges[0]
              : section === "primary"
              ? dataFees?.allSchoolFeesPrim?.edges[0]
              : dataFees?.allSchoolFees?.edges[0]
          }
          user={dataUser?.allCustomusers?.edges[0]?.node}
        />

        {/* Student Menu */}
        <View style={localStyles.gridContainer}>
          {(role === "student" || role === "parent")
            ? MenuStudent({ role, section })
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
                ))
            : null}
        </View>

        {/* Teacher/Admin Menu with notification dots */}
        <View style={localStyles.gridContainer}>
          {(role === "admin" || role === "teacher")
            ? MenuTeacher({ role, section, newNotifications })
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
                ))
            : null}
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

const GET_FEES = gql`
  query GetData($id: ID!) {
    allSchoolFees(id: $id) {
      edges {
        node {
          id
          platformPaid
          userprofile {
            id
            program {
              name
            }
            customuser {
              id
              matricle
              preinscriptionStudent {
                fullName
              }
            }
            specialty {
              academicYear
              level {
                level
              }
              mainSpecialty {
                specialtyName
              }
            }
          }
        }
      }
    }
    allSchoolFeesSec(id: $id) {
      edges {
        node {
          id
          platformPaid
          userprofilesec {
            id
            programsec
            customuser {
              id
              matricle
              preinscriptionStudent {
                fullName
              }
            }
            classroomsec {
              academicYear
              level
              classType
              series {
                name
              }
            }
          }
        }
      }
    }
  }
`;

const GET_LECTURER_USER = gql`
  query GetData($id: ID!) {
    allCustomusers(id: $id) {
      edges {
        node {
          id
          matricle
          preinscriptionLecturer {
            id
            fullName
          }
        }
      }
    }
  }
`;
