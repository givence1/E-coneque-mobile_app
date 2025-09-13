import styles from "@/assets/styles/signup.styles";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker as SelectPicker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

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
  onPrevious: () => void;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  sex: Yup.string().required("Gender is required"),
  address: Yup.string().required("Address is required"),
  pob: Yup.string().required("Place of Birth is required"),
  dob: Yup.string().required("Date of Birth is required"),
  telephone: Yup.string()
    .required("Telephone is required")
    .matches(/^\d+$/, "Must be digits only")
    .min(9, "At least 9 digits"),
  email: Yup.string().required("Email is required").email("Invalid email format"),
});

export default function Step1PersonalInfo({
  data,
  updateField,
  onNext,
  onPrevious,
}: Step1Props) {
  const router = useRouter();
  const [dobPickerVisible, setDobPickerVisible] = useState(false);

  const onChangeDob = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
    setFieldValue?: (field: string, value: any) => void
  ) => {
    if (Platform.OS !== "ios") setDobPickerVisible(false);

    if (event.type === "set" && selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      updateField("dob", formattedDate);
      if (setFieldValue) setFieldValue("dob", formattedDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Step Indicator */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
          {["Personal Info", "Role & Dept", "Specialty", "Confirm"].map((label, index) => {
            const isActive = index === 0;
            return (
              <View key={label} style={{ alignItems: "center", flex: 1 }}>
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
                  <Text
                    style={{
                      fontSize: 16,
                      color: isActive ? "#fff" : COLORS.textSecondary,
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </Text>
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

        <Formik
          initialValues={data}
          validationSchema={validationSchema}
          onSubmit={onNext}
        >
          {({ handleSubmit, setFieldValue, values, errors, touched }) => (
            <>
              <View style={styles.formContainer}>
                {/* First Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>First Name</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="First Name"
                      value={values.firstName}
                      onChangeText={(text) => {
                        updateField("firstName", text);
                        setFieldValue("firstName", text);
                      }}
                    />
                  </View>
                  {touched.firstName && errors.firstName && <Text style={{ color: "red" }}>{errors.firstName}</Text>}
                </View>

                {/* Last Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Last Name</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Last Name"
                      value={values.lastName}
                      onChangeText={(text) => {
                        updateField("lastName", text);
                        setFieldValue("lastName", text);
                      }}
                    />
                  </View>
                  {touched.lastName && errors.lastName && <Text style={{ color: "red" }}>{errors.lastName}</Text>}
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
                      selectedValue={values.sex}
                      onValueChange={(v) => {
                        updateField("sex", v);
                        setFieldValue("sex", v);
                      }}
                      style={{ flex: 1, color: COLORS.textPrimary }}
                      dropdownIconColor={COLORS.textSecondary}
                    >
                      <SelectPicker.Item label="Select Gender" value="" />
                      <SelectPicker.Item label="Male" value="MALE" />
                      <SelectPicker.Item label="Female" value="FEMALE" />
                    </SelectPicker>
                  </View>
                  {touched.sex && errors.sex && <Text style={{ color: "red" }}>{errors.sex}</Text>}
                </View>

                {/* Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Address"
                      value={values.address}
                      onChangeText={(text) => {
                        updateField("address", text);
                        setFieldValue("address", text);
                      }}
                    />
                  </View>
                  {touched.address && errors.address && <Text style={{ color: "red" }}>{errors.address}</Text>}
                </View>

                {/* Place of Birth */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Place of Birth</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Place of Birth"
                      value={values.pob}
                      onChangeText={(text) => {
                        updateField("pob", text);
                        setFieldValue("pob", text);
                      }}
                    />
                  </View>
                  {touched.pob && errors.pob && <Text style={{ color: "red" }}>{errors.pob}</Text>}
                </View>

                {/* Date of Birth */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Date of Birth</Text>
                  <TouchableOpacity
                    onPress={() => setDobPickerVisible(true)}
                    style={[styles.inputContainer, { justifyContent: "flex-start" }]}
                  >
                    <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <Text style={[styles.input, { paddingVertical: 12 }]}>
                      {values.dob || "Select Date of Birth"}
                    </Text>
                  </TouchableOpacity>
                  {dobPickerVisible && (
                    <DateTimePicker
                      value={values.dob ? new Date(values.dob) : new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "calendar"}
                      onChange={(e, date) => onChangeDob(e, date, setFieldValue)}
                      maximumDate={new Date()}
                    />
                  )}
                  {touched.dob && errors.dob && <Text style={{ color: "red" }}>{errors.dob}</Text>}
                </View>

                {/* Telephone */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Telephone</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Telephone"
                      keyboardType="phone-pad"
                      value={values.telephone}
                      onChangeText={(text) => {
                        updateField("telephone", text);
                        setFieldValue("telephone", text);
                      }}
                    />
                  </View>
                  {touched.telephone && errors.telephone && <Text style={{ color: "red" }}>{errors.telephone}</Text>}
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={values.email}
                      onChangeText={(text) => {
                        updateField("email", text);
                        setFieldValue("email", text);
                      }}
                    />
                  </View>
                  {touched.email && errors.email && <Text style={{ color: "red" }}>{errors.email}</Text>}
                </View>
              </View>

              {/* Navigation Buttons */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, marginTop: 24 }}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: COLORS.border, flex: 1 }]}
                  onPress={onPrevious}
                >
                  <Text style={[styles.buttonText, { color: COLORS.textPrimary }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account back to</Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}
