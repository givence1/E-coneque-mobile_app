import AppHeader from "@/components/AppHeader";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import COLORS from "../../../constants/colors";

type ComplaintType = string | null;

type DropDownItem = {
  label: string;
  value: string;
};

const Complaint: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [type, setType] = useState<ComplaintType>(null);
  const [items, setItems] = useState<DropDownItem[]>([
    { label: "Fee Issue", value: "fee" },
    { label: "Result Problem", value: "result" },
    { label: "Lecturer Misconduct", value: "lecturer" },
    { label: "Attendance", value: "attendance" },
    { label: "Other", value: "other" },
  ]);

  const [message, setMessage] = useState<string>("");

  const handleSubmit = () => {
    if (!type || !message.trim()) {
      Alert.alert("Error", "Please select a type and enter your message.");
      return;
    }

    Alert.alert("Submitted", "Your complaint has been submitted.");
    setType(null);
    setMessage("");
  };

  return (
     <View style={{ flex: 1, backgroundColor: COLORS.background }}>

      {/* ✅ Fixed header outside the ScrollView */}
            <AppHeader showBack showTitle />
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: 50 }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}

    >
      <Text style={styles.label}>Complaint Type</Text>
      <DropDownPicker
        open={open}
        value={type}
        items={items}
        setOpen={setOpen}
        setValue={setType}
        setItems={setItems}
        placeholder="Select type"
        style={styles.dropdown}
        dropDownContainerStyle={{ borderColor: "#ccc" }}
      />

      <Text style={styles.label}>Message</Text>
      <TextInput
        placeholder="Describe your issue..."
        value={message}
        onChangeText={setMessage}
        style={[styles.input, { height: 120 }]}
        multiline
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.primary }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Submit Complain</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
    </View>
  );
};

type Style = {
  container: ViewStyle;
  label: TextStyle;
  dropdown: ViewStyle;
  input: TextStyle;
  button: ViewStyle;
  buttonText?: TextStyle;
};

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    flex: 1,
  },
  label: {
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
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
