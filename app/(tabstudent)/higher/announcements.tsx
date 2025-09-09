import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const AnnouncementsScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Fixed Header */}
      <AppHeader showBack showTabs  showTitle  />

      <ScrollView
        style={{ marginTop: 80 }} // 👈 pushes below header
        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Announcements */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="megaphone-outline"
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.cardTitle}>Latest Announcements</Text>
          </View>
          <Text style={styles.item}>
            📌 Orientation starts Sept 1st. Don’t miss it!
          </Text>
          <Text style={styles.item}>
            📌 Exam cards are now available in the portal.
          </Text>
          <Text style={styles.item}>
            📌 Library will be closed on Friday.
          </Text>
        </View>

        {/* Events */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="calendar" size={22} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Upcoming Events</Text>
          </View>
          <Text style={styles.item}>
            🗓️ Data Structures Quiz – Friday, 10AM
          </Text>
          <Text style={styles.item}>
            🗓️ Software Eng. Class – Thursday, 2PM
          </Text>
          <Text style={styles.item}>🗓️ Graduation Ceremony – Sept 20th</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AnnouncementsScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: COLORS.primary,
  },
  item: {
    fontSize: 15,
    marginBottom: 8,
    color: COLORS.textDark,
    lineHeight: 20,
  },
});
