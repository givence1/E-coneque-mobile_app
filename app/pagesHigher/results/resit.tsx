import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import Header from "../../../components/Header";
import COLORS from "../../../constants/colors";
import { gql, useQuery } from "@apollo/client";
import { useAuthStore } from "@/store/authStore";
import { EdgeResult } from "@/utils/schemas/interfaceGraphql";
import DisplayResults from "./DisplayResults";
import { Picker } from "@react-native-picker/picker";

// Resit Results screen for Higher Education
export default function ResitResults() {
  const [semester, setSemester] = useState<"I" | "II" | null>(null);
  const { profileId } = useAuthStore();

  const { data: dataResults, loading: searchResults, error } = useQuery(GET_RESIT_RESULTS, {
    variables: {
      studentId: profileId,
    },
  });
  const [resultList, setResultList] = useState<EdgeResult[]>();

  useEffect(() => {
    if (semester && dataResults?.allResults?.edges?.length) {
      const fil = dataResults?.allResults?.edges.filter((item: EdgeResult) => item.node?.course?.semester === semester && item.node?.publishResit);
      setResultList(fil);
    }
  }, [semester, dataResults]);

  return (
    <ScrollView style={styles.container}>
      <Header placeholder="" />
      <View>
        <Picker
          selectedValue={semester}
          onValueChange={(value) => setSemester(value)}
        >
          <Picker.Item label="Select Semester" value={null} />
          <Picker.Item label="I" value="I" />
          <Picker.Item label="II" value="II" />
        </Picker>
      </View>
      {!searchResults ?
        <DisplayResults
          title="RESIT RESULTS"
          result_type="resit"
          results={resultList}
          semester={semester}
        />
        :
        <ActivityIndicator size="large" />
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
});

const GET_RESIT_RESULTS = gql`
  query GetData (
    $studentId: Decimal!
  ) {
    allResults (
      studentId: $studentId
    ) {
      edges {
        node {
          id
          student { customuser { fullName }}
          course {
            mainCourse { courseName }
            semester
            courseCode
          }
          infoData
          publishResit
        }
      }
    }
  }
`;