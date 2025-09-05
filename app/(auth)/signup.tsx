import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Step1PersonalInfo from "../../components/Step1PersonalInfo";
import Step2RoleDept from "../../components/Step2RoleDept";
import Step3Specialty from "../../components/Step3Specialty";
import Step4Confirmation from "../../components/Step4Confirmation";
import COLORS from "../../constants/colors";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", gender: "", address: "", dob: "", placeOfBirth: "",
    telephone: "", email: "", campus: "", nationality: "", region: "",
    highestCertificate: "", yearObtained: "", subjectsGrade: "", fatherName: "",
    motherName: "", fatherPhone: "", motherPhone: "", parentAddress: "",
    specialty1: "", specialty2: "", academicYear: "", program: "", level: "", session: "",
  });

  const updateField = (key: any, value: any) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 70} // adjust if header overlaps
    >
      <View style={styles.wrapper}>
        {/* Fixed Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Step {step} of 4</Text>
        </View>

        {/* Step Content */}
        <View style={{ flex: 1 }}>
          {step === 1 && (
            <Step1PersonalInfo
              data={formData}
              updateField={updateField}
              onNext={handleNext}
              onPrevious={() => {}}
            />
          )}
          {step === 2 && (
            <Step2RoleDept
              data={formData}
              updateField={updateField}
              onNext={handleNext}
              onPrevious={handleBack}
            />
          )}
          {step === 3 && (
            <Step3Specialty
              data={formData}
              updateField={updateField}
              onNext={handleNext}
              onPrevious={handleBack}
            />
          )}
          {step === 4 && (
            <Step4Confirmation
              data={formData}
              onPrevious={handleBack}
              onSubmit={() => console.log("SUBMIT:", formData)}
            />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
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
});
