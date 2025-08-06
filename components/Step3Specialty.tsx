import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../assets/styles/signup.styles";
import COLORS from "../constants/colors";

type Step3Props = {
  data: Record<string, string>;
  updateField: (field: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
};

const optionsMap: Record<string, string[]> = {
  specialty1: ["Computer Engineering", "Accounting", "Marketing"],
  specialty2: ["Networking", "HR Management", "Banking & Finance"],
  academicYear: ["2024/2025", "2025/2026", "2026/2027"],
  program: ["HND", "BTech", "BSc", "MBA"],
  level: ["100", "200", "300", "400"],
  session: ["Morning", "Evening", "Weekend"],
};

export default function Step3Specialty({
  data,
  updateField,
  onNext,
  onPrevious,
}: Step3Props) {
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

  const renderStepIndicator = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
      {["Personal Info", "Role & Dept", "Specialty", "Confirm"].map((label, index) => {
        const isActive = index === 2;
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {renderStepIndicator()}

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Specialty Details</Text>
          </View>

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
