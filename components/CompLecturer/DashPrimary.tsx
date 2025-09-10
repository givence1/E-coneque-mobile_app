import COLORS from '@/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DashPrimary = () => {

const router = useRouter();

  return (
    <View>
      {/* ✅ Student Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Student Overview</Text>
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statBox}
            >
              <Ionicons name="people-outline" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>120</Text>
              <Text style={styles.statLabel}>Students</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statBox}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={COLORS.success}
              />
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statBox}
            >
              <Ionicons
                name="trending-up-outline"
                size={24}
                color={COLORS.warning}
              />
              <Text style={styles.statValue}>72%</Text>
              <Text style={styles.statLabel}>Avg. Grade</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ Lecturer Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Lecturer Overview</Text>
          <View style={styles.statsRow}>


            <TouchableOpacity
              style={styles.statBox}
            >
              <MaterialIcons name="class" size={24} color={COLORS.warning} />
              <Text style={styles.statValue}>6</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statBox}
              onPress={() => router.push("/pagesHigher/lecturersComponents/subjects")}
            >
              <Ionicons name="book-outline" size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Subjects</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ Upload Marks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Upload Marks</Text>
          <TouchableOpacity
            style={styles.announcementCard}
            onPress={() => router.push("/(tabteacher)/portal")}
          >
            <Text style={styles.announcementText}>
              Access your courses and upload marks here.
            </Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

export default DashPrimary;




const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
  profileSub: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  announcementCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 1,
  },
  announcementText: { fontSize: 14, color: COLORS.textDark },
  statsRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  statBox: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    color: COLORS.textPrimary,
  },
  statLabel: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center" },
});