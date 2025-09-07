import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
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
  onSubmit: () => void;
  section: "H" | "S" | "P";
};

export default function Step4Confirmation({
  data,
  onPrevious,
  onSubmit
}: Step4ConfirmationProps) {


  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.section]}>Confirm Your Information</Text>

        {/* PERSONAL INFORMATION */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="person-circle-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.cardTitle}>Personal Information</Text>
          </View>
          {renderField("First Name", data.firstName)}
          {renderField("Last Name", data.lastName)}
          {renderField("Gender", data.sex)}
          {renderField("Address", data.address)}
          {renderField("Date of Birth", data.dob)}
          {renderField("Place of Birth", data.pob)}
          {renderField("Telephone", data.telephone)}
          {renderField("Email", data.email)}
        </View>

        {/* ROLE & DEPARTMENT */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="school-outline" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Role / Department</Text>
          </View>
          {renderField("Campus", data.campusId)}
          {renderField("Nationality", data.nationality)}
          {renderField("Region of Origin", data.regionOfOrigin)}
          {renderField("Highest Certificate", data.highestCertificate)}
          {renderField("Year Obtained", data.yearObtained)}
          {renderField("Subjects Grade", data.grade)}
          {renderField("Father's Name", data.fatherName)}
          {renderField("Mother's Name", data.motherName)}
          {renderField("Father's Phone", data.fatherTelephone)}
          {renderField("Mother's Phone", data.motherTelephone)}
          {renderField("Parent's Address", data.parentAddress)}
        </View>

        {/* SPECIALTY INFO */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="briefcase-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.cardTitle}>Specialty Info</Text>
          </View>
          {renderField("Specialty - 1st Choice", data.specialtyoneId)}
          {renderField("Specialty - 2nd Choice", data.specialtytwoId)}
          {renderField("Academic Year", data.academicYear)}
          {renderField("Program", data.programId)}
          {renderField("Level", data.level)}
          {renderField("Session", data.session)}
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
          >
            <Text
              style={[globalStyles.buttonText, { color: COLORS.textPrimary }]}
            >
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, { flex: 1 }]}
            onPress={onSubmit}
          >
            <Text style={globalStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Field renderer with type annotations
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
    textAlign: "center"
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


// Define type for the data prop
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
