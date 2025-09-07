import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PreinscriptionHigher from "./PreinscriptionComponents/PreinscriptionHigher";
import PreinscriptionPrimary from "./PreinscriptionComponents/PreinscriptionPrimary";
import PreinscriptionSecondary from "./PreinscriptionComponents/PreinscriptionSecondary";

export default function Signup() {
  const { schoolIdentification } = useAuthStore();
  const [section, setSection] = useState<"H" | "S" | "P" | "V">();

  const { data } = useQuery(GET_DATA, { variables: { language: "en" } });

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.content}>
        {section ? (
          <View style={{ gap: 16, marginVertical: 5 }}>
            {section === "H" ? (
              <PreinscriptionHigher section={section} data={data} />
            ) : null}

            {section === "S" ? (
              <PreinscriptionSecondary section={section} data={data} />
            ) : null}

            {section === "P" ? (
              <PreinscriptionPrimary section={section} data={data} />
            ) : null}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Select a Section</Text>

            {schoolIdentification?.hasHigher ? (
              <TouchableOpacity
                onPress={() => setSection("H")}
                style={styles.option}
              >
                <Text style={styles.optionText}>University Pre-Inscription</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            ) : null}

            {schoolIdentification?.hasSecondary ? (
              <TouchableOpacity
                onPress={() => setSection("S")}
                style={styles.option}
              >
                <Text style={styles.optionText}>Secondary Pre-Inscription</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            ) : null}

            {schoolIdentification?.hasPrimary ? (
              <TouchableOpacity
                onPress={() => setSection("P")}
                style={styles.option}
              >
                <Text style={styles.optionText}>Primary Pre-Inscription</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            ) : null}
          </View>
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
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center", // 👈 centers content vertically
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
    gap: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 10,
  },
  option: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
});

const GET_DATA = gql`
  query GetData {
    allSchoolInfos {
      edges {
        node {
          id
          campus
          address
          schoolType
        }
      }
    }
    allLevels {
      edges {
        node {
          id
          level
        }
      }
    }
    allMainSpecialties {
      edges {
        node {
          id
          specialtyName
        }
      }
    }
    allPrograms {
      edges {
        node {
          id
          name
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
