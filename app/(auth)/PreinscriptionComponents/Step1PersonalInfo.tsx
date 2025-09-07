import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker as SelectPicker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../../assets/styles/signup.styles";
import StepIndicator from "./StepIndicator";

interface Step1Props {
  data: {
    firstName?: string;
    lastName?: string;
    sex?: string;
    address?: string;
    pob?: string;
    dob?: string;
    telephone?: string;
    email?: string;
  };
  updateField: (field: string, value: string) => void;
  onNext: () => void;
  section: "H" | "S" | "P";
}

export default function Step1PersonalInfo({
  data,
  updateField,
  onNext,
}: Step1Props) {
  const router = useRouter();
  const [dobPickerVisible, setDobPickerVisible] = useState<boolean>(false);

  const onChangeDob = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setDobPickerVisible(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      updateField("dob", formattedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // 👈 ensures scrolling above keyboard
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.card}>
            <StepIndicator idx={0} />

            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>Personal Information</Text>
            </View>

            <View style={styles.formContainer}>
              {/* First Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor={COLORS.placeholderText}
                    value={data.firstName || ""}
                    onChangeText={(text) => updateField("firstName", text)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Last Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor={COLORS.placeholderText}
                    value={data.lastName || ""}
                    onChangeText={(text) => updateField("lastName", text)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Gender */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={[styles.inputContainer, { paddingLeft: 40 }]}>
                  <Ionicons
                    name="male-female-outline"
                    size={20}
                    color={COLORS.primary}
                    style={[styles.inputIcon, { left: 10 }]}
                  />
                  <SelectPicker
                    selectedValue={data.sex || ""}
                    onValueChange={(itemValue) => updateField("sex", itemValue)}
                    style={{ flex: 1, color: COLORS.textPrimary }}
                  >
                    <SelectPicker.Item label="Select Gender" value="" />
                    <SelectPicker.Item label="Male" value="MALE" />
                    <SelectPicker.Item label="Female" value="FEMALE" />
                  </SelectPicker>
                </View>
              </View>

              {/* Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Address"
                    placeholderTextColor={COLORS.placeholderText}
                    value={data.address || ""}
                    onChangeText={(text) => updateField("address", text)}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Place of Birth */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Place of Birth</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Place of Birth"
                    placeholderTextColor={COLORS.placeholderText}
                    value={data.pob || ""}
                    onChangeText={(text) => updateField("pob", text)}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Date of Birth (with picker) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity
                  onPress={() => setDobPickerVisible(true)}
                  style={[styles.inputContainer, { justifyContent: "flex-start" }]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <Text style={[styles.input, { paddingVertical: 12 }]}>
                    {data.dob ? data.dob : "Select Date of Birth"}
                  </Text>
                </TouchableOpacity>
                {dobPickerVisible && (
                  <DateTimePicker
                    value={data.dob ? new Date(data.dob) : new Date()}
                    mode="date"
                    display="spinner" // 👈 smoother for both iOS & Android
                    onChange={onChangeDob}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* Telephone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telephone</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Telephone"
                    placeholderTextColor={COLORS.placeholderText}
                    keyboardType="phone-pad"
                    value={data.telephone || ""}
                    onChangeText={(number) => updateField("telephone", number)}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor={COLORS.placeholderText}
                    value={data.email || ""}
                    onChangeText={(text) => updateField("email", text)}
                    style={styles.input}
                    autoCapitalize="none"
                  />
                </View>
              </View>
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
                style={[styles.button, { flex: 1 }]}
                onPress={onNext}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account? Back to
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
