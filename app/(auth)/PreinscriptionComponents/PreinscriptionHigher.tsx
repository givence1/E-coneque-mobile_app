import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { capitalizeFirstLetter, decodeUrlID, errorLog } from "@/utils/functions";
import { mutationCreateUpdatePreInscription } from "@/utils/graphql/mutations/mutationCreateUpdatePreInscription";
import {
  EdgeLevel,
  EdgeMainSpecialty,
  EdgeProgram,
  EdgeSchoolHigherInfo,
} from "@/utils/schemas/interfaceGraphql";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Step1PersonalInfo from "./Step1PersonalInfo";
import Step2RoleDept from "./Step2RoleDept";
import Step3Specialty from "./Step3Specialty";
import Step4Confirmation, { FormData } from "./Step4Confirmation";

type RecordMap = {
  id: number | string;
  name: string;
};

const PreinscriptionHigher = ({ data, section }: { data: any; section: "H" | "S" | "P" | "V" }) => {
  const { token } = useAuthStore();

  const campusList: RecordMap[] = data?.allSchoolInfos?.edges
    ?.filter((s: EdgeSchoolHigherInfo) => s.node.schoolType.includes("-H"))
    .map((s: EdgeSchoolHigherInfo) => ({
      id: parseInt(decodeUrlID(s.node.id) || ""),
      name: `${s.node?.campus} - ${s.node?.address}`,
    }));

  const campusName: string[] = campusList.map((c) => c.name);

  const levelList: RecordMap[] = data?.allLevels?.edges?.map((l: EdgeLevel) => ({
    id: decodeUrlID(l.node.id),
    name: l.node.level,
  }));
  const levelName: string[] = levelList.map((l) => l.name);

  const mainSpecialtyList: RecordMap[] = data?.allMainSpecialties?.edges?.map((ms: EdgeMainSpecialty) => ({
    id: parseInt(decodeUrlID(ms.node.id) || ""),
    name: ms.node.specialtyName,
  }));
  const mainSpecialtyName: string[] = mainSpecialtyList.map((ms) => ms.name);

  const programList: RecordMap[] = data?.allPrograms?.edges?.map((ms: EdgeProgram) => ({
    id: parseInt(decodeUrlID(ms.node.id) || ""),
    name: ms.node.name,
  }));
  const programName: string[] = programList.map((p) => p.name);

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
  // Map names to IDs
  const campusId = campusList.find((c) => c.name === formData.campusId)?.id;
  const levelId = levelList.find((l) => l.name === formData.level)?.id;
  const programId = programList.find((p) => p.name === formData.programId)?.id;
  const specialtyOne = mainSpecialtyList.find((ms) => ms.name === formData.specialtyoneId)?.id;
  const specialtyTwo = mainSpecialtyList.find((ms) => ms.name === formData.specialtytwoId)?.id;

  if (!campusId || !levelId || !programId || !specialtyOne || !specialtyTwo) {
    throw new Error("Please select all required fields correctly.");
  }

  const payload = {
    section: section, // ✅ add this
    language: "en",
    registrationNumber: formData.firstName?.toUpperCase(),
    firstName: formData.firstName?.toUpperCase(),
    lastName: formData.lastName?.toUpperCase(),
    fullName: `${formData.firstName?.toUpperCase()} ${formData.lastName?.toUpperCase()}`,
    sex: formData.sex,
    email: formData.email?.toLowerCase(),
    telephone: formData.telephone,
    address: formData.address?.toUpperCase(),
    pob: formData.pob,
    dob: formData.dob,

    fatherName: formData.fatherName ? formData.fatherName.toUpperCase() : "None",
    motherName: formData.motherName ? formData.motherName.toUpperCase() : "None",
    parentAddress: formData.parentAddress ? formData.parentAddress.toUpperCase() : "None",
    fatherTelephone: formData.fatherTelephone,
    motherTelephone: formData.motherTelephone,
    campusId,

    nationality: formData.nationality,
    regionOfOrigin:
      formData.regionOfOrigin === "Other"
        ? capitalizeFirstLetter(formData.regionOfOriginOther?.toLowerCase() || "")
        : formData.regionOfOrigin,
    highestCertificate:
      formData.highestCertificate === "Other"
        ? capitalizeFirstLetter(formData.highestCertificateOther?.toLowerCase() || "")
        : formData.highestCertificate,
    yearObtained: formData.yearObtained,
    grade: formData.grade,

    academicYearHigher: formData.academicYear,
    levelHigher: levelId,
    sessionHigher: formData.session,
    programHigherId: programId,
    specialtyOne,
    specialtyTwo,
    status: "PENDING",
    admissionStatus: false,
    action: "CREATING",
    delete: false,
  };

  try {
    const resUserId = await mutationCreateUpdatePreInscription({
      section, // also pass the prop directly
      formData: payload,
      p: null,
      router: null,
      routeToLink: "",
      token,
    });

    if (!resUserId || resUserId.length === 0) {
      throw new Error("Backend did not accept the data.");
    }

    return true; // indicate success
  } catch (error) {
    errorLog(error);
    throw error; // propagate to Step4Confirmation
  }
};

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Step {step} of 4</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && (
          <Step1PersonalInfo
            section={section}
            data={formData}
            updateField={updateField}
            onNext={handleNext}
            onPrevious={handleBack}
          />
        )}
        {step === 2 && (
          <Step2RoleDept
            section={section}
            data={formData}
            updateField={updateField}
            onNext={handleNext}
            onPrevious={handleBack}
            apiSchools={campusName}
          />
        )}
        {step === 3 && (
          <Step3Specialty
            section={section}
            data={formData}
            updateField={updateField}
            onNext={handleNext}
            onPrevious={handleBack}
            apiMainSpecialties={mainSpecialtyName}
            apiLevels={levelName}
            apiLevelsSec={[]}
            apiLevelsPrim={[]}
            apiYears={data?.allAcademicYears}
            apiYearsSec={[]}
            apiYearsPrim={[]}
            apiPrograms={programName}
            apiProgramsSec={[]}
            apiProgramsPrim={[]}
          />
        )}
        {step === 4 && (
          <Step4Confirmation
            section={section}
            data={formData}
            onPrevious={handleBack}
            onSubmit={handleSubmit}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default PreinscriptionHigher;

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
    backgroundColor: COLORS.background,
  },
});
