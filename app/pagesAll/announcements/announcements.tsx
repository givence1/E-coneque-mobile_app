import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const AnnouncementsScreen = () => {
  const announcements = [
    "Orientation starts Sept 1st. Don’t miss it!",
    "Exam cards are now available in the portal.",
    "Library will be closed on Friday.",
  ];

  const events = [
    { title: "Data Structures Quiz", time: "Friday, 10AM" },
    { title: "Software Eng. Class", time: "Thursday, 2PM" },
    { title: "Graduation Ceremony", time: "Sept 20th" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Fixed Header */}
      <AppHeader showBack showTabs showTitle />

      <ScrollView
        style={{ marginTop: 65 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Announcements & Events</Text>
        <Text style={styles.pageSubtitle}>
          Stay updated with the latest news
        </Text>

        {/* Announcements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="megaphone-outline"
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.sectionTitle}>Latest Announcements</Text>
          </View>

          {announcements.map((note, index) => (
            <View key={index} style={styles.announcementCard}>
              <Ionicons
                name="notifications-outline"
                size={18}
                color={COLORS.primary}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.announcementText}>{note}</Text>
            </View>
          ))}
        </View>

        {/* Events Timeline */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="calendar" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
          </View>

          <View style={styles.timeline}>
            {events.map((event, index) => (
              <View key={index} style={styles.timelineItem}>
                {/* Dot + Line */}
                <View style={styles.timelineLeft}>
                  <View style={styles.dot} />
                  {index < events.length - 1 && <View style={styles.line} />}
                </View>

                {/* Event Content */}
                <View style={styles.timelineContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AnnouncementsScreen;

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: COLORS.textDark,
  },
  announcementCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  announcementText: {
    fontSize: 15,
    color: COLORS.textDark,
    flex: 1,
    lineHeight: 20,
  },
  timeline: {
    marginTop: 6,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: "center",
    marginRight: 12,
    width: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#ccc",
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 13,
    color: COLORS.textPrimary,
  },
});
