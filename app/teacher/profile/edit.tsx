import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors";

export default function EditLecturerProfileScreen(): JSX.Element {
  const [name, setName] = useState<string>("Dr. Patrisco Givence");
  const [email, setEmail] = useState<string>("patrisco@example.com");
  const [department, setDepartment] = useState<string>("Computer Science");

  const handleUpdate = (): void => {
    if (!name || !email || !department) {
      Alert.alert("Missing Fields", "Please fill out all the fields.");
      return;
    }

    // TODO: Save changes to backend
    Alert.alert("Success", "Profile updated successfully.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: "https://via.placeholder.com/120" }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="camera-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter full name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter email"
        />

        <Text style={styles.label}>Department</Text>
        <TextInput
          style={styles.input}
          value={department}
          onChangeText={setDepartment}
          placeholder="Enter department"
        />

        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.updateText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ImageStyle;
  editIcon: ViewStyle;
  form: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  updateBtn: ViewStyle;
  updateText: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.border,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 120 / 2 - 20,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 6,
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: COLORS.textSecondary,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  updateBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 30,
  },
  updateText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
