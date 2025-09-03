import { useAuthStore } from "@/store/authStore";
import { EdgeResult } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Header from "../../../components/Header";
import COLORS from "../../../constants/colors";
import DisplayResults from "../../pagesHigher/results/DisplayResults";

// Exam Results screen
export default function ExamResults() {
  const [semester, setSemester] = useState<"I" | "II" | null>(null);
  const { profileId } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const { data: dataResults, loading: searchResults, refetch } = useQuery(GET_EXAM_RESULTS, {
    variables: { studentId: profileId },
  });

  const [resultList, setResultList] = useState<EdgeResult[]>();

  useEffect(() => {
    if (semester && dataResults?.allResults?.edges?.length) {
      const fil = dataResults?.allResults?.edges.filter(
        (item: EdgeResult) =>
          item.node?.course?.semester === semester && item.node?.publishExam
      );
      setResultList(fil);
    }
  }, [semester, dataResults]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header placeholder="Exam Results" />

      {/* Semester Picker */}
      <View style={styles.dropdownWrapper}>
        <Picker
          selectedValue={semester}
          onValueChange={(value) => setSemester(value)}
          style={styles.picker}
          dropdownIconColor={COLORS.primary}
        >
          <Picker.Item label="📘 Select semester" value={null} />
          <Picker.Item label="Semester I" value="I" />
          <Picker.Item label="Semester II" value="II" />
        </Picker>
      </View>

      {/* Loading State */}
      {searchResults ? (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching your results…</Text>
        </View>
      ) : resultList?.length ? (
        <DisplayResults
          title={`Results - Semester ${semester}`}
          result_type="results"
          results={resultList}
          semester={semester}
        />
      ) : (
        // Empty State
        <View style={styles.emptyWrapper}>
          <Ionicons name="school-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>
            No results available for this semester yet.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1, padding: 16 },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: { height: 50, color: COLORS.textPrimary },
  loaderWrapper: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyWrapper: {
    marginTop: 50,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});

const GET_EXAM_RESULTS = gql`
  query GetData($studentId: Decimal!) {
    allResults(studentId: $studentId) {
      edges {
        node {
          id
          student { customuser { fullName }}
          course {
            mainCourse { courseName }
            semester
          }
          infoData
          publishExam
        }
      }
    }
  }
`;
