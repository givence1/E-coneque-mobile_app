import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Step1PersonalInfo from "../../components/Step1PersonalInfo";
import Step2RoleDept from "../../components/Step2RoleDept";
import Step3Specialty from "../../components/Step3Specialty";
import Step4Confirmation from "../../components/Step4Confirmation";
import COLORS from "../../constants/colors";

export default function signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", gender: "", address: "", dob: "", placeOfBirth: "",
    telephone: "", email: "", campus: "", nationality: "", region: "",
    highestCertificate: "", yearObtained: "", subjectsGrade: "", fatherName: "",
    motherName: "", fatherPhone: "", motherPhone: "", parentAddress: "",
    specialty1: "", specialty2: "", academicYear: "", program: "", level: "", session: "",
  });

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <View style={styles.wrapper}>
      {/* Modern Fixed Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Step {step} of 4</Text>
      </View>

      {/* Scrollable Form Area */}
      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && (
          <Step1PersonalInfo data={formData} updateField={updateField} onNext={handleNext} />
        )}
        {step === 2 && (
          <Step2RoleDept data={formData} updateField={updateField} onNext={handleNext} onPrevious={handleBack} />
        )}
        {step === 3 && (
          <Step3Specialty data={formData} updateField={updateField} onNext={handleNext} onPrevious={handleBack} />
        )}
        {step === 4 && (
          <Step4Confirmation data={formData} onPrevious={handleBack} onSubmit={() => console.log("SUBMIT:", formData)} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    fontFamily: "JetBrainsMono-Medium",
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
});
