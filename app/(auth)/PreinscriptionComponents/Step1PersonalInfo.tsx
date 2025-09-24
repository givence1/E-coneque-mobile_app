import styles from "@/assets/styles/signup.styles";
import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker as SelectPicker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // ✅ add i18n hook
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
  section: "H" | "S" | "P" | "V"
  updateField: (field: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step1PersonalInfo({
  data,
  updateField,
  onNext,
  onPrevious,
}: Step1Props) {
  const router = useRouter();
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const { t } = useTranslation(); // ✅ translation hook

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(t("validation.firstName")),
    lastName: Yup.string().required(t("validation.lastName")),
    sex: Yup.string().required(t("validation.gender")),
    address: Yup.string().required(t("validation.address")),
    pob: Yup.string().required(t("validation.pob")),
    dob: Yup.string().required(t("validation.dob")),
    telephone: Yup.string()
      .required(t("validation.telephone"))
      .matches(/^\d+$/, t("validation.telephoneDigits"))
      .min(9, t("validation.telephoneLength")),
    email: Yup.string().required(t("validation.email")).email(t("validation.emailFormat")),
  });

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
          {[t("steps.personalInfo"), t("steps.roleDept"), t("steps.specialty"), t("steps.confirm")].map(
            (label, index) => {
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
            }
          )}
        </View>

        <Formik initialValues={data} validationSchema={validationSchema} onSubmit={onNext}>
          {({ handleSubmit, setFieldValue, values, errors, touched }) => (
            <>
              <View style={styles.formContainer}>
                {/* First Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t("form.firstName")}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={t("form.firstName")}
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
                  <Text style={styles.label}>{t("form.lastName")}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={t("form.lastName")}
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
                  <Text style={styles.label}>{t("form.gender")}</Text>
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
                      <SelectPicker.Item label={t("form.selectGender")} value="" />
                      <SelectPicker.Item label={t("gender.male")} value="MALE" />
                      <SelectPicker.Item label={t("gender.female")} value="FEMALE" />
                    </SelectPicker>
                  </View>
                  {touched.sex && errors.sex && <Text style={{ color: "red" }}>{errors.sex}</Text>}
                </View>

                {/* Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t("form.address")}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={t("form.address")}
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
                  <Text style={styles.label}>{t("form.pob")}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={t("form.pob")}
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
                  <Text style={styles.label}>{t("form.dob")}</Text>
                  <TouchableOpacity
                    onPress={() => setDobPickerVisible(true)}
                    style={[styles.inputContainer, { justifyContent: "flex-start" }]}
                  >
                    <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <Text style={[styles.input, { paddingVertical: 12 }]}>
                      {values.dob || t("form.dob")}
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
                  <Text style={styles.label}>{t("form.telephone")}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={t("form.telephone")}
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
                  <Text style={styles.label}>{t("form.email")}</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={t("form.email")}
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
                  <Text style={[styles.buttonText, { color: COLORS.textPrimary }]}>{t("actions.back")}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={() => handleSubmit()}>
                  <Text style={styles.buttonText}>{t("actions.next")}</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>{t("footer.alreadyAccount")}</Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.link}>{t("footer.login")}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}
