import COLORS from '@/constants/colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DashHigher = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View>
      {/* ✅ Student Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 {t("dashHigher.higher")}</Text>
        <Text style={styles.sectionTitle}>📊 {t("dashHigher.studentOverview")}</Text>
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statBox}>
            <Ionicons name="people-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>120</Text>
            <Text style={styles.statLabel}>{t("dashHigher.students")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statBox}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color={COLORS.success}
            />
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>{t("dashHigher.attendance")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statBox}>
            <Ionicons
              name="trending-up-outline"
              size={24}
              color={COLORS.warning}
            />
            <Text style={styles.statValue}>72%</Text>
            <Text style={styles.statLabel}>{t("dashHigher.avgGrade")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Lecturer Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 {t("dashHigher.lecturerOverview")}</Text>
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statBox}>
            <MaterialIcons name="class" size={24} color={COLORS.warning} />
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>{t("dashHigher.classes")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push("/pagesHigher/courses/index")}
          >
            <Ionicons name="book-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>{t("dashHigher.courses")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Upload Marks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 {t("dashHigher.uploadMarks")}</Text>
        <TouchableOpacity
          style={styles.announcementCard}
          onPress={() => router.push("/(tabteacher)/portal")}
        >
          <Text style={styles.announcementText}>
            {t("dashHigher.uploadMessage")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashHigher;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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