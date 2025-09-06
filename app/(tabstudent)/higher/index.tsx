import ProfileHeader from "@/components/ProfileHeader";
import TabsHeader from "@/components/studentHeader/TabsHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


const StudentHome = () => {
  const router = useRouter();
  const { feesId } = useAuthStore();

  const { data: dataFees, loading, error } = useQuery(GET_FEES, {
    variables: { id: feesId },
  });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Fixed Header */}
      <TabsHeader />

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{
          paddingTop: 80, // 👈 space for header
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Info Card */}
        <ProfileHeader
          fees={
            dataFees?.allSchoolFees?.edges[0] ||
            dataFees?.allSchoolFeesSec?.edges[0] ||
            dataFees?.allSchoolFeesPrim?.edges[0]
          }
        />

        {/* Quick Action Boxes */}
        <View style={localStyles.gridContainer}>
          {[
            {
              label: "CA",
              route: "/pagesHigher/results/ca",
              icon: <Feather name="file-text" size={24} color={COLORS.primary} />,
            },
            {
              label: "Exam",
              route: "/pagesHigher/results/exam",
              icon: <MaterialIcons name="edit" size={24} color={COLORS.primary} />,
            },
            {
              label: "Resit",
              route: "/pagesHigher/results/resit",
              icon: <Feather name="list" size={24} color={COLORS.primary} />,
            },
            {
              label: "Results",
              route: "/pagesHigher/results/results",
              icon: <MaterialIcons name="school" size={24} color={COLORS.primary} />,
            },
            {
              label: "Fees",
              route: "/pagesHigher/fee/fee",
              icon: <Feather name="credit-card" size={24} color={COLORS.primary} />,
            },
            {
              label: "Transcript",
              route: "/pagesHigher/transcript",
              icon: <MaterialIcons name="description" size={24} color={COLORS.primary} />,
            },
            {
              label: "Complaints",
              route: "/pagesHigher/profile/complaint",
              icon: <Ionicons name="alert-circle-outline" size={24} color={COLORS.primary} />,
            },
            {
              label: "More",
              route: "/pagesHigher/more",
              icon: <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.primary} />,
            },
          ].map((item, index) => (
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


export default StudentHome;


// Local Styles
const localStyles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  box: {
    width: "47%",
    backgroundColor: "white",
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
  query GetData (
    $id: ID!
  ) {
    allSchoolFees (
      id: $id
    ) {
      edges {
        node {
          id platformPaid
          userprofile {
            id
            program { name }
            customuser { id matricle fullName }
            specialty { 
              academicYear
              level { level }
              mainSpecialty { specialtyName }
            }
          }
        }
      }
    }
  }
`;