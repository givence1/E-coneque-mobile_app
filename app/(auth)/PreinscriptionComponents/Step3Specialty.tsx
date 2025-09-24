import styles from "@/assets/styles/signup.styles";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Yup from "yup";
import StepIndicator from "./StepIndicator";

type Step3Props = {
  data: Record<string, string>;
  updateField: (field: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  apiMainSpecialties: string[];
  apiLevels: string[];
  apiLevelsSec: string[];
  apiLevelsPrim: string[];
  apiYears: string[];
  apiYearsSec: string[];
  apiYearsPrim: string[];
  apiPrograms: string[];
  apiProgramsSec: string[];
  apiProgramsPrim: string[];
  section: "H" | "S" | "P" | "V";
};

export default function Step3Specialty({
  data,
  updateField,
  onNext,
  onPrevious,
  apiLevels,
  apiLevelsSec,
  apiLevelsPrim,
  apiMainSpecialties,
  apiYears,
  apiYearsSec,
  apiYearsPrim,
  apiPrograms,
  apiProgramsSec,
  apiProgramsPrim,
  section,
}: Step3Props) {
  const { t } = useTranslation();

  // Pick correct API lists based on section
  const levelOptions =
    section === "H" ? apiLevels : section === "S" ? apiLevelsSec : apiLevelsPrim;

  const yearOptions =
    section === "H"
      ? apiYears.slice(0, 1)
      : section === "S"
      ? apiYearsSec.slice(0, 1)
      : apiYearsPrim.slice(0, 1);

  const programOptions =
    section === "H" ? apiPrograms : section === "S" ? apiProgramsSec : apiProgramsPrim;

  const sessionOptions = ["morning", "evening"];

  // Options map
  const optionsMap: Record<string, string[]> = {
    specialtyoneId: apiMainSpecialties,
    specialtytwoId: apiMainSpecialties,
    academicYear: yearOptions,
    programId: programOptions,
    level: levelOptions,
    session: sessionOptions,
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    specialtyoneId: Yup.string().required(
      t("validation.required", { field: t("form.specialtyone") })
    ),
    specialtytwoId: Yup.string().required(
      t("validation.required", { field: t("form.specialtytwo") })
    ),
    academicYear: Yup.string().required(
      t("validation.required", { field: t("form.academicYear") })
    ),
    programId: Yup.string().required(
      t("validation.required", { field: t("form.program") })
    ),
    level: Yup.string().required(
      t("validation.required", { field: t("form.level") })
    ),
    session: Yup.string().required(
      t("validation.required", { field: t("form.session") })
    ),
  });

  const [popupField, setPopupField] = useState<string | null>(null);

  const getFieldLabel = (field: string) => {
    switch (field) {
      case "specialtyoneId":
        return t("form.specialtyone");
      case "specialtytwoId":
        return t("form.specialtytwo");
      case "programId":
        return t("form.program");
      default:
        return t(`form.${field}`);
    }
  };

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
        <StepIndicator idx={2} />

        <Formik
          initialValues={data}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values) => {
            Object.keys(values).forEach((k) => updateField(k, values[k]));
            onNext();
          }}
        >
          {({ values, errors, touched, setFieldValue, handleSubmit }) => (
            <View style={styles.card}>
              <View style={styles.formContainer}>
                {Object.keys(optionsMap).map((field) => (
                  <View key={field} style={styles.inputGroup}>
                    <Text style={styles.label}>{getFieldLabel(field)}</Text>
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
                        {values[field]
                          ? field === "session"
                            ? t(`form.sessionOptions.${values[field]}`)
                            : values[field]
                          : t("form.selectField", { field: getFieldLabel(field) })}
                      </Text>
                    </TouchableOpacity>
                    {errors[field] && touched[field] && (
                      <Text style={{ color: "red", fontSize: 12 }}>{errors[field]}</Text>
                    )}

                    {/* Popup modal */}
                    {popupField === field && (
                      <Modal transparent animationType="fade" visible={true}>
                        <View style={local.popupOverlay}>
                          <View style={local.popupContainer}>
                            <Text style={local.popupTitle}>
                              {t("form.selectField", { field: getFieldLabel(field) })}
                            </Text>
                            <FlatList
                              data={optionsMap[field]}
                              keyExtractor={(item, index) =>
                                field === "session" ? item : `${item}-${index}`
                              }
                              renderItem={({ item }) => (
                                <Pressable
                                  style={local.popupItem}
                                  onPress={() => {
                                    setFieldValue(field, item);
                                    setPopupField(null);
                                  }}
                                >
                                  <Text style={local.popupItemText}>
                                    {field === "session"
                                      ? t(`form.sessionOptions.${item}`)
                                      : item}
                                  </Text>
                                </Pressable>
                              )}
                            />
                            <Pressable
                              onPress={() => setPopupField(null)}
                              style={local.popupCancel}
                            >
                              <Text style={local.popupCancelText}>{t("actions.cancel")}</Text>
                            </Pressable>
                          </View>
                        </View>
                      </Modal>
                    )}
                  </View>
                ))}
              </View>

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
                    {t("actions.back")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { flex: 1 }]}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.buttonText}>{t("actions.next")}</Text>
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
