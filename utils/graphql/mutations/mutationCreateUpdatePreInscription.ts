'use client';
import { removeEmptyFields } from "@/utils/functions";
import { gql } from "@apollo/client";
import { ApiFactory } from "../ApiFactory";


export const mutationCreateUpdatePreInscription = async (
  { section, formData, p, routeToLink, router, token }:
    { section: "H" | "S" | "P" | "V", formData: any, p: any, routeToLink: string, router: any, token: any }
) => {

  const newData: any = {
     id: formData?.id || null,
  language: p?.locale || formData?.language || "en",
  section: formData.section,
  firstName: formData?.firstName?.toString().toUpperCase(),
  lastName: formData?.lastName?.toString().toUpperCase(),
  sex: formData?.sex?.toString().toUpperCase(),
  email: formData?.email?.toString().toLowerCase(),
  telephone: formData?.telephone,
  address: formData?.address?.toString().toUpperCase(),
  pob: formData?.pob?.toString().toUpperCase(),
  dob: formData?.dob,

    nationality: formData?.nationality,
    regionOfOrigin: formData?.regionOfOrigin,
    highestCertificate: formData?.highestCertificate,
    yearObtained: formData?.yearObtained,
    grade: formData?.grade,
    fatherName: formData?.fatherName?.toString().toUpperCase(),
    motherName: formData?.motherName?.toString().toUpperCase(),
    parentAddress: formData?.parentAddress?.toString().toUpperCase(),
    fatherTelephone: formData?.fatherTelephone?.toString().toUpperCase(),
    motherTelephone: formData?.motherTelephone?.toString().toUpperCase(),

    academicYearHigher: formData?.academicYearHigher,
    academicYearSecondary: formData?.academicYearSecondary,
    academicYearPrimary: formData?.academicYearPrimary,
    academicYearVocational: formData?.academicYearVocational,
    levelHigher: formData?.levelHigher,
    levelSecondary: formData?.levelSecondary,
    levelPrimary: formData?.levelPrimary,
    levelVocational: formData?.levelVocational,
    programHigherId: formData?.programHigherId,
    programSecondary: formData?.programSecondary,
    programPrimary: formData?.programPrimary,
    programVocational: formData?.programVocational,
    sessionSecondary: formData?.sessionSecondary,
    sessionPrimary: formData?.sessionPrimary,

    specialtyOneId: formData?.specialtyOne,
    specialtyTwoId: formData?.specialtyTwo,
    stream: formData?.stream,
    seriesOneId: formData?.seriesOneId,
    
    action: formData?.action,
    campusId: formData?.campusId,
    status: formData?.status,
    admissionStatus: formData?.admissionStatus,
    delete: false,
  };

  const preInscripSuccessFieldData = await ApiFactory({
    newData: removeEmptyFields(newData),
    editData: removeEmptyFields(newData),
    mutationName: "createUpdateDeletePreinscription",
    modelName: "preinscription",
    successField: "id",
    query: queryPreInscription,
    router,
    params: p,
    redirect: false,
    reload: false,
    returnResponseField: true,
    redirectPath: ``,
    actionLabel: "creating",
    token
  });



  if (preInscripSuccessFieldData) {
    if (routeToLink) {
      router.push(routeToLink);
    }
    return preInscripSuccessFieldData
  } else {
    return false
  }
}







export const mutationCreateUpdatePreInscriptionLecturer = async (
  { formData, fileData, p, routeToLink, router, token }:
    { fileData: any, formData: any, p: any, routeToLink: string, router: any, token: any }
) => {

  const generateRegNumber = (): string => {
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${year}${random}`.slice(0, 10);
  };

  const fileMap: Record<string, File> = {};
  ["cv", "niu", "nic"].forEach((key) => {
    const value = fileData?.get(key);
    if (value instanceof File) {
      fileMap[key] = value;
    }
  });

  const data: any = {
    ...formData,
    registrationNumber: formData?.registrationNumber || generateRegNumber(),
    language: formData?.language || p?.locale,
    firstName: formData?.firstName?.toString().toUpperCase()?.trim(),
    lastName: formData?.lastName?.toString().toUpperCase()?.trim(),
    sex: formData?.sex?.toString().toUpperCase(),
    email: formData?.email?.toString()?.trim().toLowerCase(),
    telephone: formData?.telephone?.trim(),
    address: formData?.address?.toString().toUpperCase()?.trim() || "-",
    pob: formData?.pob?.toString()?.trim().toUpperCase() || "-",
    dob: formData?.dob || "1980-01-01",

    nationality: formData?.nationality?.trim(),
    regionOfOrigin: formData?.regionOfOrigin?.trim() || "-",
    highestCertificate: formData?.highestCertificate?.trim(),
    yearObtained: formData?.yearObtained,
    fatherName: formData?.fatherName?.trim(),
    motherName: formData?.motherName?.trim(),
    parentAddress: formData?.parentAddress?.trim(),
    action: formData?.action,
    campusId: formData?.campusId || p.school_id,
    status: formData?.status,
    admissionStatus: formData?.admissionStatus,
    infoData: formData.infoData,

    delete: false,
  };

  const preInscripSuccessFieldData = await ApiFactory({
    newData: data,
    editData: data,
    mutationName: "createUpdateDeletePreinscriptionLecturer",
    modelName: "preinscriptionlecturer",
    successField: "id",
    query: queryPreInscriptionLecturer,
    router,
    params: p,
    redirect: false,
    reload: false,
    returnResponseField: true,
    redirectPath: ``,
    actionLabel: "creating",
    getFileMap: () => fileMap,
    token
  });

  if (preInscripSuccessFieldData) {
    if (routeToLink) {
      router.push(routeToLink);
    }
    return preInscripSuccessFieldData
  } else {
    return false
  }
}






const queryPreInscriptionLecturer = gql`
  mutation Create(
    $id: ID
    $registrationNumber: String
    $language: String
    $firstName: String
    $lastName: String
    $sex: String
    $email: String
    $telephone: String
    $address: String
    $pob: String
    $dob: String

    $nationality: String
    $regionOfOrigin: String
    $highestCertificate: String
    $yearObtained: String
    $fatherName: String
    $fatherTelephone: String
    $parentAddress: String
    $action: String
    $status: String
    $admissionStatus: Boolean
    $infoData: JSONString!
    $cv: Upload
    $niu: Upload
    $nic: Upload
    $delete: Boolean!
  ) {
    createUpdateDeletePreinscriptionLecturer(
      id: $id
      registrationNumber: $registrationNumber
      language: $language
      firstName: $firstName
      lastName: $lastName
      sex: $sex
      address: $address
      email: $email
      telephone: $telephone
      pob: $pob
      dob: $dob

      nationality: $nationality
      regionOfOrigin: $regionOfOrigin
      highestCertificate: $highestCertificate
      yearObtained: $yearObtained
      fatherName: $fatherName
      fatherTelephone: $fatherTelephone
      parentAddress: $parentAddress
      action: $action
      status: $status
      admissionStatus: $admissionStatus
      infoData: $infoData
      cv: $cv
      niu: $niu
      nic: $nic
      delete: $delete
    ) {
      preinscriptionlecturer {
        id firstName fullName
      }
    }
  }
`;


const queryPreInscription = gql`
  mutation Create(
    $id: ID
    $language: String!
    $section: String!

    $firstName: String!
    $lastName: String!
    $sex: String!
    $email: String
    $telephone: String
    $address: String!
    $pob: String!
    $dob: String!

    $nationality: String!
    $regionOfOrigin: String!
    $highestCertificate: String
    $yearObtained: String
    $grade: String
    $fatherName: String
    $motherName: String
    $parentAddress: String
    $fatherTelephone: String
    $motherTelephone: String

    $academicYearHigher: String
    $academicYearSecondary: String
    $academicYearPrimary: String
    $levelHigher: String
    $levelSecondary: String
    $levelPrimary: String
    $programHigherId: ID
    $programSecondary: String
    $programPrimary: String
    $sessionHigher: String
    $sessionSecondary: String

    $specialtyOneId: ID
    $specialtyTwoId: ID
    $stream: String
    $seriesOneId: ID

    $nic: Upload
    
    $action: String!
    $campusId: ID!
    $status: String!
    $admissionStatus: Boolean!
    $delete: Boolean!
  ) {
    createUpdateDeletePreinscription(
      id: $id      
      language: $language
      section: $section
      firstName: $firstName
      lastName: $lastName
      sex: $sex
      email: $email
      telephone: $telephone
      address: $address
      pob: $pob
      dob: $dob

      nationality: $nationality
      regionOfOrigin: $regionOfOrigin
      highestCertificate: $highestCertificate
      yearObtained: $yearObtained
      grade: $grade
      fatherName: $fatherName
      motherName: $motherName
      parentAddress: $parentAddress
      fatherTelephone: $fatherTelephone
      motherTelephone: $motherTelephone

      academicYearHigher: $academicYearHigher
      academicYearSecondary: $academicYearSecondary
      academicYearPrimary: $academicYearPrimary
      levelHigher: $levelHigher
      levelSecondary: $levelSecondary
      levelPrimary: $levelPrimary
      programHigherId: $programHigherId
      programSecondary: $programSecondary
      programPrimary: $programPrimary
      sessionHigher: $sessionHigher
      sessionSecondary: $sessionSecondary

      specialtyOneId: $specialtyOneId
      specialtyTwoId: $specialtyTwoId
      stream: $stream
      seriesOneId: $seriesOneId
      
      nic: $nic

      action: $action
      campusId: $campusId
      status: $status
      admissionStatus: $admissionStatus
      delete: $delete
    ) {
      preinscription {
        id firstName
      }
    }
  }
`;