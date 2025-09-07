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
import styles from "../../../assets/styles/signup.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import StepIndicator from "./StepIndicator";

type Step2Props = {
  data: Record<string, string>;
  updateField: (field: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  section: "H" | "S" | "P";
  apiSchools: string[];
};

type FormValues = {
  campusId: string;
  nationality: string;
  region: string;
  highestCertificate: string;
  yearObtained: string;
  grade?: string;
  fatherName?: string;
  motherName?: string;
  fatherTelephone?: string;
  motherTelephone?: string;
  parentAddress?: string;
};

const validationSchema = Yup.object().shape({
  campusId: Yup.string().required("Campus is required"),
  nationality: Yup.string().required("Nationality is required"),
  regionOfOrigin: Yup.string().required("Region is required"),
  highestCertificate: Yup.string().required("Certificate is required"),
  yearObtained: Yup.string().required("Year obtained is required"),
  grade: Yup.string(),
  fatherName: Yup.string(),
  motherName: Yup.string(),
  fatherTelephone: Yup.string(),
  motherTelephone: Yup.string(),
  parentAddress: Yup.string(),
});



export default function Step2RoleDept({
  data,
  updateField,
  onNext,
  onPrevious,
  section,
  apiSchools
}: Step2Props) {

  const optionsMap: Record<string, string[]> = {
    campusId: apiSchools,
    nationality: ["Cameroon", "Nigeria", "Tchad", "Congo", "Guineq", "Gabon", "International"],
    regionOfOrigin: ["South West", "North West", "Center", "Other"],
    highestCertificate: ["GCE O/L", "GCE A/L", "Bachelor's"],
    yearObtained: Array.from({ length: 15 }, (_, i) => `${new Date().getFullYear() - i}`),
  };
  console.log(data);

  const [popupField, setPopupField] = useState<string | null>(null);


  const renderPopup = (field: string) => (
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

        <StepIndicator idx={1} />

        <View style={styles.formContainer}>
          {Object.keys(optionsMap).map((field) => (
            <View key={field} style={styles.inputGroup}>
              <Text style={styles.label}>{field.replace(/([A-Z])/g, " $1")}</Text>
              <TouchableOpacity
                onPress={() => setPopupField(field)}
                style={[styles.inputContainer, { justifyContent: "flex-start" }]}
              >
                <Ionicons name="chevron-down-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <Text style={[styles.input, { paddingVertical: 12 }]}>
                  {data[field] || `Select ${field}`}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {popupField && renderPopup(popupField)}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Grade</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Grade"
                placeholderTextColor={COLORS.placeholderText}
                value={data.grade || ""}
                onChangeText={(text) => updateField("grade", text)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Father's Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Father's Name"
                placeholderTextColor={COLORS.placeholderText}
                value={data.fatherName || ""}
                onChangeText={(text) => updateField("fatherName", text)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Father's Telephone</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Father's Telephone"
                placeholderTextColor={COLORS.placeholderText}
                value={data.fatherTelephone || ""}
                onChangeText={(text) => updateField("fatherTelephone", text)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mother's Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mother's Name"
                placeholderTextColor={COLORS.placeholderText}
                value={data.motherName || ""}
                onChangeText={(text) => updateField("motherName", text)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mother's Telephone</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mother's Telephone"
                placeholderTextColor={COLORS.placeholderText}
                value={data.motherTelephone || ""}
                onChangeText={(text) => updateField("motherTelephone", text)}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Parent's Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Parent's Address"
                placeholderTextColor={COLORS.placeholderText}
                value={data.parentAddress || ""}
                onChangeText={(text) => updateField("parentAddress", text)}
                autoCapitalize="words"
              />
            </View>
          </View>

        </View>

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
            <Text style={[styles.buttonText, { color: COLORS.textPrimary }]}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={onNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
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
