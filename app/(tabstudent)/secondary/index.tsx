import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import TabsHeader from "../../../components/TabsHeader";
import { useRouter } from "expo-router";
import COLORS from "@/constants/colors";
import styles from "@/assets/styles/home.styles";
import Header from "../../profileHeader/Header";
import { gql, useQuery } from "@apollo/client";
import { useAuthStore } from "@/store/authStore";


const StudentHome = () => {
  const router = useRouter();
  const { feesId } = useAuthStore();

  const { data: dataFees, loading, error } = useQuery(GET_FEES, {
    variables: {
      id: feesId,
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, marginBottom: 16, }}>
      {/* Fixed Header */}
      <TabsHeader />

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        style={{ marginTop: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Info Card */}
        <Header
          fees={
            dataFees?.allSchoolFees?.edges[0] ||
            dataFees?.allSchoolFeesSec?.edges[0] ||
            dataFees?.allSchoolFeesPrim?.edges[0]
        }
        />

        {/* Announcements */}
        <View style={styles.bookCard}>
          <Text style={styles.bookTitle}>📣 Announcements</Text>
          <Text style={styles.caption}>
            📌 Orientation starts Sept 1st. Make sure to check your department schedule.
          </Text>
        </View>

        {/* Upcoming */}
        <View style={styles.bookCard}>
          <Text style={styles.bookTitle}>🗓️ Upcoming</Text>
          <Text style={styles.caption}>📘 Data Structures Quiz – Friday, 10AM</Text>
          <Text style={styles.caption}>📗 Software Eng. Class – Thursday, 2PM</Text>
        </View>

        {/* Quick Action Boxes */}
        <View style={localStyles.gridContainer}>
          {[
            {
              label: "CA",
              route: "/pagesSecondary/results/ca",
              icon: <Feather name="file-text" size={24} color={COLORS.primary} />,
            },
            {
              label: "Exam",
              route: "/pagesSecondary/results/exam",
              icon: <MaterialIcons name="edit" size={24} color={COLORS.primary} />,
            },
            {
              label: "Resit",
              route: "/pagesSecondary/results/resit",
              icon: <Feather name="list" size={24} color={COLORS.primary} />,
            },
            {
              label: "Results",
              route: "results",
              icon: <MaterialIcons name="school" size={24} color={COLORS.primary} />,
            },
            {
              label: "Fees",
              route: "/pagesSecondary/fee/fees",
              icon: <Feather name="credit-card" size={24} color={COLORS.primary} />,
            },
            {
              label: "Courses",
              route: "courses",
              icon: <Ionicons name="book-outline" size={24} color={COLORS.primary} />,
            },
            {
              label: "Transcript",
              route: "/pagesSecondary/transcript",
              icon: <MaterialIcons name="description" size={24} color={COLORS.primary} />,
            },
            {
              label: "Complaints",
              route: "/pagesSecondary/profile/complaint",
              icon: <Ionicons name="alert-circle-outline" size={24} color={COLORS.primary} />,
            },
            {
              label: "More",
              route: "/pagesSecondary/more",
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

        {/* Quick Links */}
        <View style={[styles.bookCard, { paddingVertical: 10 }]}>
          <Text style={styles.bookTitle}>🚀 Quick Links</Text>

          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="book-outline" size={20} color={COLORS.textPrimary} />
            <Text style={[styles.caption, { marginLeft: 10 }]}>View My Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.textPrimary} />
            <Text style={[styles.caption, { marginLeft: 10 }]}>My Timetable</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="bar-chart-outline" size={20} color={COLORS.textPrimary} />
            <Text style={[styles.caption, { marginLeft: 10 }]}>View Results</Text>
          </TouchableOpacity>
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
    allSchoolFeesSec (
      id: $id
    ) {
      edges {
        node {
          id platformPaid
          userprofilesec {
            id
            customuser { id matricle fullName }
          }
        }
      }
    }
  }
`;