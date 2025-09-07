import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PreinscriptionHigher from "./PreinscriptionComponents/PreinscriptionHigher";
import PreinscriptionSecondary from "./PreinscriptionComponents/PreinscriptionSecondary";
import PreinscriptionPrimary from "./PreinscriptionComponents/PreinscriptionPrimary";


export default function signup() {

  const { schoolIdentification } = useAuthStore();
  const [section, setSection] = useState<"H" | "S" | "P" | "V">()

  const { data, loading, error } = useQuery(GET_DATA, {
    variables: { language: "en" }
  });

  console.log(section);
  console.log(data);
  
  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.content}>

        {
          section ?
            <View
              style={{ gap: 16, marginVertical: 5 }}
            >

              {section === "H" ?
                <PreinscriptionHigher
                  section={section}
                  data={data}
                /> : null}

              {section === "S" ?
                <PreinscriptionSecondary
                  section={section}
                  data={data}
                /> : null}

              {section === "P" ?
                <PreinscriptionPrimary
                  section={section}
                  data={data}
                /> : null}

            </View>
            :
            <View
              style={{ gap: 16, marginVertical: 20 }}
            >
              <Text>Select A Section</Text>
            </View>
        }

        {
          !section ? schoolIdentification ?
            <View
              style={{ gap: 16 }}
            >

              {schoolIdentification?.hasHigher ?
                <TouchableOpacity
                  onPress={() => setSection("H")}
                  style={{ flexDirection: "row", gap: 4 }}
                >
                  <Text>University Pre-Inscription</Text>
                  <Ionicons name="arrow-forward" size={16} color="green" />
                </TouchableOpacity> : null}

              {schoolIdentification?.hasSecondary ?
                <TouchableOpacity
                  onPress={() => setSection("S")}
                  style={{ flexDirection: "row", gap: 4 }}
                >
                  <Text>Secondary Pre-Inscription</Text>
                  <Ionicons name="arrow-forward" size={16} color="green" />
                </TouchableOpacity> : null}

              {schoolIdentification?.hasPrimary ?
                <TouchableOpacity
                  onPress={() => setSection("P")}
                  style={{ flexDirection: "row", gap: 4 }}
                >
                  <Text>Primary Pre-Inscription</Text>
                  <Ionicons name="arrow-forward" size={16} color="green" />
                </TouchableOpacity> : null}

            </View>
            :
            <View>Check School Info</View>
            : null
        }

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
    paddingBottom: 20,
  },
});



const GET_DATA = gql`
  query GetData {
    allSchoolInfos {
      edges {
        node {
          id campus address schoolType
        }
      }
    }
    allLevels {
      edges {
        node {
          id level
        }
      }
    }
    allMainSpecialties {
      edges {
        node {
          id specialtyName
        }
      }
    }
    allPrograms {
      edges {
        node {
          id name
        }
      }
    }
    getProgramsSec
    getProgramsPrim
    getLevelsSec
    getLevelsPrim
    allAcademicYears
    allAcademicYearsSec
    allAcademicYearsPrim
  }
`;
