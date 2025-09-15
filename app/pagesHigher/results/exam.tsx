import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { EdgeResult } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import DisplayResults from "./DisplayResults";

// Exam Results screen for Higher Education
export default function ExamResults() {
  const { t } = useTranslation();
  const [semester, setSemester] = useState<"I" | "II" | null>(null);
  const { profileId } = useAuthStore();

  const {
    data: dataResults,
    loading: searchResults,
    error,
  } = useQuery(GET_EXAM_RESULTS, {
    variables: {
      studentId: profileId,
    },
  });
  const [resultList, setResultList] = useState<EdgeResult[]>();

  useEffect(() => {
    if (semester && dataResults?.allResults?.edges?.length) {
      const fil = dataResults?.allResults?.edges.filter(
        (item: EdgeResult) =>
          item.node?.course?.semester === semester &&
          item.node?.publishExam
      );
      setResultList(fil);
    }
  }, [semester, dataResults]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* ✅ Fixed header outside the ScrollView */}
      <AppHeader showBack showTitle />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: 50 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={semester}
            onValueChange={(value) => setSemester(value)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            dropdownIconColor={COLORS.primary}
          >
            <Picker.Item
              label={t("examResults.selectSemester")}
              value={null}
              style={styles.optionPlaceholder}
            />
            <Picker.Item
              label={t("examResults.semesterI")}
              value="I"
              style={styles.optionItem}
            />
            <Picker.Item
              label={t("examResults.semesterII")}
              value="II"
              style={styles.optionItem}
            />
          </Picker>
        </View>
        {!searchResults ? (
          <DisplayResults
            title={t("examResults.title")}
            result_type="exam"
            results={resultList}
            semester={semester}
          />
        ) : (
          <ActivityIndicator size="large" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.cardBackground,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    paddingHorizontal: 1,
    color: COLORS.textPrimary,
  },
  pickerItem: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  optionPlaceholder: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  optionItem: {
    fontSize: 16,
    color: COLORS.textDark,
  },
});

const GET_EXAM_RESULTS = gql`
  query GetData($studentId: Decimal!) {
    allResults(studentId: $studentId) {
      edges {
        node {
          id
          student {
            customuser {
              fullName
            }
          }
          course {
            mainCourse {
              courseName
            }
            semester
            courseCode
          }
          infoData
          publishExam
        }
      }
    }
  }
`;
