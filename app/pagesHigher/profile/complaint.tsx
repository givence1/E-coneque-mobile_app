import AppHeader from "@/components/AppHeader";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import COLORS from "../../../constants/colors";

// ---------- Types ----------
type ComplaintType = string | null;

type DropDownItem = {
  label: string;
  value: string;
};

const Complaint: React.FC = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ComplaintType>(null);
  const [items, setItems] = useState<DropDownItem[]>([
    { label: t("ui.feeIssue"), value: "fee" },
    { label: t("ui.resultProblem"), value: "result" },
    { label: t("ui.lecturerMisconduct"), value: "lecturer" },
    { label: t("ui.attendance"), value: "attendance" },
    { label: t("ui.other"), value: "other" },
  ]);

  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!type || !message.trim()) {
      Alert.alert(t("ui.error"), t("ui.errorMessage"));
      return;
    }

    Alert.alert(t("ui.submitted"), t("ui.submittedMessage"));
    setType(null);
    setMessage("");
  };

  return (
    <View style={styles.wrapper}>
      {/* Fixed Header */}
      <AppHeader showBack showTitle />

      {/* Content */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.label}>{t("ui.complaintType")}</Text>
        <DropDownPicker
          open={open}
          value={type}
          items={items}
          setOpen={setOpen}
          setValue={setType}
          setItems={setItems}
          placeholder={t("ui.selectType")}
          style={styles.dropdown}
          dropDownContainerStyle={{ borderColor: "#ccc" }}
        />

        <Text style={styles.label}>{t("ui.message")}</Text>
        <TextInput
          placeholder={t("ui.describeIssue")}
          value={message}
          onChangeText={setMessage}
          style={[styles.input, { height: 120 }]}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t("ui.submitComplaint")}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

// ---------- Styles ----------
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    paddingTop: 70, // space under header
  },
  label: {
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    color: COLORS.textPrimary,
  },
  dropdown: {
    borderColor: "#ccc",
    marginBottom: 10,
    zIndex: 1000,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Complaint;
