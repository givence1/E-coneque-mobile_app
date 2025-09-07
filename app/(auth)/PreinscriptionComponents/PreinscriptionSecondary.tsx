import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import COLORS from "@/constants/colors";
import Step1PersonalInfo from "./Step1PersonalInfo";
import Step2RoleDept from "./Step2RoleDept";
import Step3Specialty from "./Step3Specialty";
import Step4Confirmation, { FormData } from "./Step4Confirmation";
import { EdgeLevel, EdgeMainSpecialty, EdgeSchoolHigherInfo } from "@/utils/schemas/interfaceGraphql";
import { mutationCreateUpdatePreInscription } from "@/utils/graphql/mutations/mutationCreateUpdatePreInscription";
import { capitalizeFirstLetter, errorLog } from "@/utils/functions";


const PreinscriptionHigher = (
  { data, section }:
    { data: any, section: "H" | "S" | "P" }
) => {

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    sex: "",
    address: "",
    dob: "",
    pob: "",
    telephone: "",
    email: "",

    campusId: "",
    nationality: "",
    regionOfOrigin: "",
    regionOfOriginOther: "",
    highestCertificate: "",
    highestCertificateOther: "",
    yearObtained: "",
    grade: "",
    fatherName: "",
    motherName: "",
    fatherTelephone: "",
    motherTelephone: "",
    parentAddress: "",

    specialtyoneId: "",
    specialtytwoId: "",
    academicYear: "",
    programId: "",
    level: "",
    session: "",
  });

  const updateField = (key: any, value: any) => setFormData((prev) => ({ ...prev, [key]: value }));
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

    const handleSubmit = async () => {

      const newData = {
      language: "en",
      registrationNumber: formData?.firstName?.toString().toUpperCase(),
      firstName: formData?.firstName?.toString().toUpperCase(),
      lastName: formData?.lastName?.toString().toUpperCase(),
      fullName: formData?.firstName?.toString().toUpperCase() + " " + formData?.lastName?.toString().toUpperCase(),
      sex: formData?.sex,
      email: formData?.email?.toString().toLowerCase(),
      telephone: formData?.telephone,
      address: formData?.address?.toString().toUpperCase(),
      pob: formData?.pob,
      dob: formData?.dob,

      fatherName: formData?.fatherName ? formData?.fatherName?.toString().toUpperCase() : "None",
      motherName: formData?.motherName ? formData?.motherName?.toString().toUpperCase() : "None",
      parentAddress: formData?.parentAddress ? formData?.parentAddress?.toString().toUpperCase() : "None",
      fatherTelephone: formData?.fatherTelephone,
      motherTelephone: formData?.motherTelephone,
      campusId: formData?.campusId,

      nationality: formData?.nationality,
      regionOfOrigin: formData.regionOfOrigin === "Other" ? capitalizeFirstLetter(formData?.regionOfOriginOther?.toLowerCase() || "") : formData?.regionOfOrigin,
      highestCertificate: formData?.highestCertificate === "Other" ? capitalizeFirstLetter(formData?.highestCertificateOther?.toLowerCase() || "") : formData?.highestCertificate,
      yearObtained: formData?.yearObtained,
      grade: formData.grade,

      academicYear: formData?.academicYear,
      programId: formData?.programId,
      level: formData?.level,
      session: formData?.session,
      specialtyOne: formData?.specialtyoneId,
      specialtyTwo: formData?.specialtytwoId,
      status: "PENDING",
      admissionStatus: false,
      action: "CREATING",
      delete: false,
    }
    // setCount(10)

    if ([newData].length > 0) {
      for (let index = 0; index < [newData].length; index++) {
        const dataToSubmit = [newData][index];
        
        try {
          const resUserId = await mutationCreateUpdatePreInscription({
            section: "S",
            formData: dataToSubmit,
            p: null,
            router: null,
            routeToLink: "",
          })

          if (resUserId.length > 5) {
            // alert(t("Operation Successful") + " " + `✅`)
            alert("Operation Successful" + " " + `✅`)
            window.location.reload();
          }
        } catch (error) {
          errorLog(error);
        }

      }
    }
  };
  
  return (
    <View style={styles.wrapper}>
      {/* Modern Fixed Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Step {step} of 4</Text>
      </View>

      {/* Scrollable Form Area */}
      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && (
          <Step1PersonalInfo
            section={section}
            data={formData}
            updateField={updateField}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <Step2RoleDept
            section={section}
            data={formData}
            updateField={updateField}
            onNext={handleNext}
            onPrevious={handleBack}
            apiSchools={data?.allSchoolInfos?.edges?.filter((s: EdgeSchoolHigherInfo) => s.node.schoolType.includes("-S")).map((s: EdgeSchoolHigherInfo) => `${s.node?.campus} - ${s.node?.address}`)}
            />
        )}
        {step === 3 && (
          <Step3Specialty
            section={section}
            data={formData}
            updateField={updateField}
            onNext={handleNext}
            onPrevious={handleBack}
            apiMainSpecialties={data?.allMainSpecialties?.edges?.map((ms: EdgeMainSpecialty) => ms.node.specialtyName)}
            apiLevels={[]}
            apiLevelsSec={data?.getLevelsSec}
            apiLevelsPrim={[]}
            apiYears={[]}
            apiYearsSec={data?.allAcademicYearsSec}
            apiYearsPrim={[]}
            apiPrograms={[]}
            apiProgramsSec={data?.allProgramsSec}
            apiProgramsPrim={[]}
            />
        )}
        {step === 4 && (
          <Step4Confirmation
            section={section}
            data={formData}
            onPrevious={handleBack}
            onSubmit={() => console.log("SUBMIT:", formData)}
          />
        )}
      </ScrollView>
    </View>
  );
}

export default PreinscriptionHigher

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 16,
    marginBottom: 16,
    paddingHorizontal: 10,
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
    padding: 0,
    backgroundColor: COLORS.background
  },
});
