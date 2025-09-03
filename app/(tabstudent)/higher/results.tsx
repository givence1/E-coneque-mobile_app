import Header from "@/components/Header";
import { useAuthStore } from "@/store/authStore";
import { EdgeResult } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import COLORS from "../../../constants/colors";
import DisplayResults from "../../pagesHigher/results/DisplayResults";

// Exam Results screen for Higher Education
export default function ExamResults() {
  const [semester, setSemester] = useState<"I" | "II" | null>(null);
  const { profileId } = useAuthStore();

  const { data: dataResults, loading, error } = useQuery(GET_EXAM_RESULTS, {
    variables: {
      studentId: profileId, // must match backend type
    },
  });

  const [resultList, setResultList] = useState<EdgeResult[]>([]);

  useEffect(() => {
    if (semester && dataResults?.allResults?.edges?.length) {
      const fil = dataResults.allResults.edges.filter(
        (item: EdgeResult) =>
          item.node?.course?.semester === semester &&
          item.node?.publishExam
      );
      setResultList(fil);
    }
  }, [semester, dataResults]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Header placeholder="" />

      <View style={styles.dropdownWrapper}>
        <Picker
          selectedValue={semester}
          onValueChange={(value) => setSemester(value)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          dropdownIconColor={COLORS.primary}
        >
          <Picker.Item
            label="Select semester"
            value={null}
            style={styles.optionPlaceholder}
          />
          <Picker.Item label="I" value="I" style={styles.optionItem} />
          <Picker.Item label="II" value="II" style={styles.optionItem} />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <DisplayResults
          title="ALL RESULTS"
          result_type="results"
          results={resultList}
          semester={semester}
        />
      )}
    </ScrollView>
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
    paddingHorizontal: 10,
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
  query GetData($studentId: ID!) {
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
