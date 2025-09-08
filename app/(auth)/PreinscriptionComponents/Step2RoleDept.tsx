import styles from "@/assets/styles/signup.styles";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import StepIndicator from "./StepIndicator";

type Step2Props = {
  data: Record<string, string>;
  updateField: (field: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  section: "H" | "S" | "P";
  apiSchools: string[];
};

const validationSchema = Yup.object().shape({
  campusId: Yup.string().required("Campus is required"),
  nationality: Yup.string().required("Nationality is required"),
  regionOfOrigin: Yup.string().required("Region is required"),
  highestCertificate: Yup.string().required("Certificate is required"),
  yearObtained: Yup.string().required("Year obtained is required"),
});

export default function Step2RoleDept({
  data,
  updateField,
  onNext,
  onPrevious,
  section,
  apiSchools,
}: Step2Props) {
  const optionsMap: Record<string, string[]> = {
    campusId: apiSchools,
    nationality: [
      "Cameroon",
      "Nigeria",
      "Tchad",
      "Congo",
      "Guinea",
      "Gabon",
      "International",
    ],
    regionOfOrigin: ["South West", "North West", "Center", "Littoral", "Other"],
    highestCertificate: ["GCE O/L", "GCE A/L", "Bachelor's"],
    yearObtained: Array.from({ length: 15 }, (_, i) => `${new Date().getFullYear() - i}`),
  };

  const [popupField, setPopupField] = useState<string | null>(null);

  const renderPopup = (field: string) => (
    <Modal transparent animationType="fade" visible={!!popupField}>
      <View style={local.popupOverlay}>
        <View style={local.popupContainer}>
          <Text style={local.popupTitle}>Select Campus</Text>
          <FlatList
            data={optionsMap[field]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={local.popupItem}
                onPress={() => {
                  updateField(field, item);
                  setPopupField(null);
                }}
              >
                <Text style={local.popupItemText}>{item}</Text>
              </Pressable>
            )}
          />
          <Pressable onPress={() => setPopupField(null)} style={local.popupCancel}>
            <Text style={local.popupCancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 70}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Step Indicator */}
        <StepIndicator idx={1} />

        <Formik
          initialValues={data}
          validationSchema={validationSchema}
          onSubmit={onNext}
        >
          {({ errors, touched }) => (
            <View style={styles.formContainer}>
              {/* Dropdown Fields */}
              {Object.keys(optionsMap).map((field) => (
                <View key={field} style={styles.inputGroup}>
                  <Text style={styles.label}>
                    {field.replace(/([A-Z])/g, " $1")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setPopupField(field)}
                    style={[styles.inputContainer, { justifyContent: "flex-start" }]}
                  >
                    <Ionicons
                      name="chevron-down-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <Text style={[styles.input, { paddingVertical: 12 }]}>
                      {data[field] || `Select Campus`}
                    </Text>
                  </TouchableOpacity>
                  {errors[field] && touched[field] && (
                    <Text style={{ color: "red", fontSize: 12 }}>{errors[field]}</Text>
                  )}
                </View>
              ))}

              {popupField && renderPopup(popupField)}

              {/* Manual Inputs */}
              {[
                { key: "grade", label: "Grade" },
                { key: "fatherName", label: "Father's Name" },
                { key: "fatherTelephone", label: "Father's Telephone" },
                { key: "motherName", label: "Mother's Name" },
                { key: "motherTelephone", label: "Mother's Telephone" },
                { key: "parentAddress", label: "Parent's Address" },
              ].map(({ key, label }) => (
                <View key={key} style={styles.inputGroup}>
                  <Text style={styles.label}>{label}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder={label}
                      placeholderTextColor={COLORS.placeholderText}
                      value={data[key] || ""}
                      onChangeText={(text) => updateField(key, text)}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              ))}

              {/* Navigation Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 12,
                  marginTop: 24,
                }}
              >
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: COLORS.border, flex: 1 }]}
                  onPress={onPrevious}
                >
                  <Text style={[styles.buttonText, { color: COLORS.textPrimary }]}>
                    Back
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { flex: 1 }]}
                  onPress={onNext}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const local = StyleSheet.create({
  popupOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    maxHeight: "60%",
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  popupItem: {
    paddingVertical: 10,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  popupItemText: {
    fontSize: 16,
  },
  popupCancel: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  popupCancelText: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
});
