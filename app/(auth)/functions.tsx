import { mutationCreateUpdatePreInscriptionLecturer } from "@/utils/graphql/mutations/mutationCreateUpdatePreInscription";
import { NodeCustomUser } from "@/utils/schemas/interfaceGraphql";
import { gql } from "@apollo/client";

const updateRegistrationLecturer = async (
    { customuser }:
        { customuser: NodeCustomUser | any }
) => {

    if (customuser && customuser?.role === "teacher") {
        console.log(customuser);
        const newData: any = {
            ...customuser,
            registrationNumber: customuser?.matricle,
            language: customuser?.language,
            firstName: customuser?.firstName?.toString().toUpperCase(),
            lastName: customuser?.lastName?.toString().toUpperCase(),
            sex: customuser?.sex.toString().toUpperCase(),
            email: customuser?.email?.toString().toLowerCase(),
            telephone: customuser?.telephone,
            address: customuser?.address?.toString().toUpperCase() || "-",
            pob: customuser?.pob?.toString().toUpperCase() || "-",
            dob: customuser?.dob || "1980-01-01",

            nationality: customuser?.nationality,
            regionOfOrigin: customuser?.regionOfOrigin || "-",
            highestCertificate: customuser?.highestCertificate,
            yearObtained: customuser?.yearObtained,
            fatherName: customuser?.fatherName,
            motherName: customuser?.motherName,
            parentAddress: customuser?.parentAddress,
            action: "UPDATING",
            campusId: customuser?.campusId,
            status: "ADMITTED",
            admissionStatus: true,
            infoData: customuser?.infoData,

            delete: false,
        };

        console.log(newData);
        try {
            const response = await mutationCreateUpdatePreInscriptionLecturer({
                section: "H",
                formData: newData,
                p: null,
                router: null,
                routeToLink: "",
                token: customuser?.token || "", // Add token property, adjust as needed
            })
            console.log(response);
            return response;
            
        } catch (error) {
            console.log(error);
        }

    }

    return true;
}


const queryPreInscriptionLecturer = gql`
  mutation Create(
    $id: ID
    $registrationNumber: String
    $language: String!
    $firstName: String!
    $lastName: String!
    $sex: String!
    $email: String!
    $telephone: String!
    $address: String!
    $pob: String!
    $dob: String!

    $nationality: String!
    $regionOfOrigin: String!
    $highestCertificate: String!
    $yearObtained: String!
    $fatherName: String
    $fatherTelephone: String
    $parentAddress: String
    $action: String!
    $status: String!
    $admissionStatus: Boolean!
    $infoData: JSONString!
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
      delete: $delete
    ) {
      preinscriptionlecturer {
        id firstName fullName
      }
    }
  }
`;