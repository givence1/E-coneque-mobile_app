import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Header from "../../../components/Header";
import COLORS from "../../../constants/colors";

const EditProfileScreen: React.FC = () => {
  const [name, setName] = useState<string>("Patrisco Givence");
  const [email, setEmail] = useState<string>("npatrisco@gmail.com");
  const [phone, setPhone] = useState<string>("673351854");
  const [department, setDepartment] = useState<string>("Software Engineering");

  const handleSubmit = () => {
    Alert.alert("Success", "Profile updated successfully.");
    // Future: integrate backend API here
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Header placeholder="Search profile..." />
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor={COLORS.placeholderText}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          placeholderTextColor={COLORS.placeholderText}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          placeholderTextColor={COLORS.placeholderText}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Department (optional)</Text>
        <TextInput
          style={styles.input}
          value={department}
          onChangeText={setDepartment}
          placeholder="Department"
          placeholderTextColor={COLORS.placeholderText}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Ionicons name="save-outline" size={20} color={COLORS.white} />
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;

// ---------- Styles Types ----------
type Styles = {
  container: ViewStyle;
  title: TextStyle;
  inputGroup: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  saveButton: ViewStyle;
  saveButtonText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});
