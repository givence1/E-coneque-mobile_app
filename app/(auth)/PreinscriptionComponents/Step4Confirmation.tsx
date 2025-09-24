import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import globalStyles from "../../../assets/styles/signup.styles";

type Step4ConfirmationProps = {
  data: FormData;
  onPrevious: () => void;
  onSubmit: () => Promise<boolean>; // returns true if success
  section: "H" | "S" | "P" | "V";
};

export default function Step4Confirmation({
  data,
  onPrevious,
  onSubmit,
}: Step4ConfirmationProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const success = await onSubmit();

      if (success) {
        Alert.alert(
          t("confirm.title"),
          t("confirm.success"),
          [
            {
              text: t("actions.ok"),
              onPress: () => router.replace("/(auth)/signup"),
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          t("confirm.title"),
          t("confirm.error"),
          [{ text: t("actions.ok") }],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error("Submit failed:", error);
      Alert.alert(
        t("confirm.title"),
        t("confirm.error"),
        [{ text: t("actions.ok") }],
        { cancelable: false }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.section]}>{t("confirm.title")}</Text>

        {/* PERSONAL INFORMATION */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="person-circle-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.cardTitle}>{t("steps.personalInfo")}</Text>
          </View>
          {renderField(t("form.firstName"), data.firstName)}
          {renderField(t("form.lastName"), data.lastName)}
          {renderField(t("form.gender"), data.sex)}
          {renderField(t("form.address"), data.address)}
          {renderField(t("form.dob"), data.dob)}
          {renderField(t("form.pob"), data.pob)}
          {renderField(t("form.telephone"), data.telephone)}
          {renderField(t("form.email"), data.email)}
        </View>

        {/* ROLE & DEPARTMENT */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="school-outline" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>{t("steps.roleDept")}</Text>
          </View>
          {renderField(t("form.campusId"), data.campusId)}
          {renderField(t("form.nationality"), data.nationality)}
          {renderField(t("form.regionOfOrigin"), data.regionOfOrigin)}
          {renderField(t("form.highestCertificate"), data.highestCertificate)}
          {renderField(t("form.yearObtained"), data.yearObtained)}
          {renderField(t("form.grade"), data.grade)}
          {renderField(t("form.fatherName"), data.fatherName)}
          {renderField(t("form.motherName"), data.motherName)}
          {renderField(t("form.fatherTelephone"), data.fatherTelephone)}
          {renderField(t("form.motherTelephone"), data.motherTelephone)}
          {renderField(t("form.parentAddress"), data.parentAddress)}
        </View>

        {/* SPECIALTY INFO */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="briefcase-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.cardTitle}>{t("steps.specialty")}</Text>
          </View>
          {renderField(t("form.specialtyone"), data.specialtyoneId)}
          {renderField(t("form.specialtytwo"), data.specialtytwoId)}
          {renderField(t("form.academicYear"), data.academicYear)}
          {renderField(t("form.program"), data.programId)}
          {renderField(t("form.level"), data.level)}
          {renderField(t("form.session"), data.session)}
        </View>

        {/* BOTTOM BUTTONS */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={[
              globalStyles.button,
              { backgroundColor: COLORS.border, flex: 1 },
            ]}
            onPress={onPrevious}
            disabled={loading}
          >
            <Text
              style={[globalStyles.buttonText, { color: COLORS.textPrimary }]}
            >
              {t("actions.back")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, { flex: 1 }]}
            onPress={handleFinalSubmit}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {loading ? t("actions.submitting") : t("actions.submit")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Field renderer with translation support
function renderField(label: string, value?: string) {
  return (
    <View style={styles.fieldRow} key={label}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  section: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 20,
    color: COLORS.textDark,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 10,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 6,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 8,
    color: "#111",
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  fieldLabel: {
    fontSize: 16,
    color: "#444",
    flex: 1,
    fontWeight: "500",
  },
  fieldValue: {
    fontSize: 16,
    color: "#222",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
});

export type FormData = {
  firstName?: string;
  lastName?: string;
  sex?: string;
  address?: string;
  dob?: string;
  pob?: string;
  telephone?: string;
  email?: string;

  campusId?: string;
  nationality?: string;
  regionOfOrigin?: string;
  regionOfOriginOther?: string;
  highestCertificate?: string;
  highestCertificateOther?: string;
  yearObtained?: string;
  grade?: string;
  fatherName?: string;
  motherName?: string;
  fatherTelephone?: string;
  motherTelephone?: string;
  parentAddress?: string;

  specialtyoneId?: string;
  specialtytwoId?: string;
  academicYear?: string;
  programId?: string;
  level?: string;
  session?: string;
};