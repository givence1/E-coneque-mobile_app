import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../assets/styles/signup.styles";
import COLORS from "../constants/colors";

type Step2Props = {
  data: Record<string, string>;
  updateField: (field: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
};

type FormValues = {
  campus: string;
  nationality: string;
  region: string;
  highestCertificate: string;
  yearObtained: string;
  subjectsGrade?: string;
  fatherName?: string;
  motherName?: string;
  fatherPhone?: string;
  motherPhone?: string;
  parentAddress?: string;
};

const validationSchema = Yup.object().shape({
  campus: Yup.string().required("Campus is required"),
  nationality: Yup.string().required("Nationality is required"),
  region: Yup.string().required("Region is required"),
  highestCertificate: Yup.string().required("Certificate is required"),
  yearObtained: Yup.string().required("Year obtained is required"),
  subjectsGrade: Yup.string(),
  fatherName: Yup.string(),
  motherName: Yup.string(),
  fatherPhone: Yup.string(),
  motherPhone: Yup.string(),
  parentAddress: Yup.string(),
});

const optionsMap: Record<string, string[]> = {
  campus: ["Campus A", "Campus B"],
  nationality: ["Cameroon", "Nigeria", "Ghana"],
  region: ["South West", "North West", "Center"],
  highestCertificate: ["GCE O/L", "GCE A/L", "Bachelor's"],
  yearObtained: Array.from({ length: 30 }, (_, i) => `${2000 + i}`),
};

export default function Step2RoleDept({
  data,
  updateField,
  onNext,
  onPrevious,
}: Step2Props) {
  const [popupField, setPopupField] = useState<string | null>(null);

  const renderStepIndicator = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
      {["Personal Info", "Role & Dept", "Specialty", "Confirm"].map((label, index) => {
        const isActive = index === 1;
        return (
          <View key={index} style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isActive ? COLORS.primary : COLORS.border,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text style={{ color: COLORS.white }}>{index + 1}</Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: isActive ? COLORS.primary : COLORS.textSecondary,
                textAlign: "center",
              }}
            >
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const renderPopup = (
    field: keyof FormValues,
    setFieldValue: (field: string, value: string) => void
  ) => (
    <Modal transparent animationType="fade" visible={!!popupField}>
      <View style={local.popupOverlay}>
        <View style={local.popupContainer}>
          <Text style={local.popupTitle}>Select {field}</Text>
          <FlatList
            data={optionsMap[field]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                style={local.popupItem}
                onPress={() => {
                  setFieldValue(field, item);
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 70}
    >
      <ScrollView
        contentContainerStyle={[styles.container]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderStepIndicator()}

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Role & Department</Text>
          </View>

          <Formik
            initialValues={data as FormValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              Object.entries(values).forEach(([key, value]) => updateField(key, value));
              onNext();
            }}
          >
            {({ handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.formContainer}>
                {/* Dropdowns */}
                {Object.keys(optionsMap).map((field) => (
                  <View key={field} style={styles.inputGroup}>
                    <Text style={styles.label}>{field.replace(/([A-Z])/g, " $1")}</Text>
                    <TouchableOpacity
                      onPress={() => setPopupField(field)}
                      style={[styles.inputContainer, { justifyContent: "flex-start" }]}
                    >
                      <Ionicons name="chevron-down-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                      <Text style={[styles.input, { paddingVertical: 12 }]}>
                        {values[field as keyof FormValues] || `Select ${field}`}
                      </Text>
                    </TouchableOpacity>
                    {touched[field as keyof FormValues] && errors[field as keyof FormValues] && (
                      <Text style={{ color: "red", fontSize: 12 }}>{errors[field as keyof FormValues]}</Text>
                    )}
                  </View>
                ))}

                {popupField && renderPopup(popupField as keyof FormValues, setFieldValue)}

                {/* Manual Inputs */}
                {[
                  { label: "Subjects & Grades", key: "subjectsGrade", icon: "document-text-outline" },
                  { label: "Father's Name", key: "fatherName", icon: "person-outline" },
                  { label: "Mother's Name", key: "motherName", icon: "person-outline" },
                  { label: "Father's Phone", key: "fatherPhone", icon: "call-outline", keyboardType: "phone-pad" },
                  { label: "Mother's Phone", key: "motherPhone", icon: "call-outline", keyboardType: "phone-pad" },
                  { label: "Parent Address", key: "parentAddress", icon: "home-outline" },
                ].map(({ label, key, icon, keyboardType }) => (
                  <View style={styles.inputGroup} key={key}>
                    <Text style={styles.label}>{label}</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons name={icon} size={20} color={COLORS.primary} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder={`e.g. ${label}`}
                        placeholderTextColor={COLORS.placeholderText}
                        keyboardType={keyboardType || "default"}
                        value={data[key] || ""}
                        onChangeText={(text) => updateField(key, text)}
                      />
                    </View>
                  </View>
                ))}

                {/* Navigation Buttons */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, marginTop: 24 }}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: COLORS.border, flex: 1 }]}
                    onPress={onPrevious}
                  >
                    <Text style={[styles.buttonText, { color: COLORS.textPrimary }]}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={handleSubmit as any}>
                    <Text style={styles.buttonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
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
