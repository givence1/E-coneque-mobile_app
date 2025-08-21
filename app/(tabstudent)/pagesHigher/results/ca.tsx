import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import Header from "../../../../components/Header";
import COLORS from "../../../../constants/colors";
import { gql, useQuery } from "@apollo/client";
import { useAuthStore } from "@/store/authStore";
import { EdgeResult } from "@/utils/schemas/interfaceGraphql";
import DisplayResults from "./DisplayResults";

const caResults = [
  { course: "OBSTETRIC NURSING II", ca: 20 },
  { course: "INTENSIVE CARE I", ca: 40 },
  { course: "PEDIATRIC PATHOLOGY/NURSING I", ca: 30.5 },
];

export default function CAResults() {

  const [semester, setSemester] = useState<"I" | "II" | null>(null)
  const { profileId } = useAuthStore();

  const { data: dataResults, loading: searchResults, error } = useQuery(GET_RESULTS, {
    variables: {
      studentId: profileId,
    },
  });
  const [resultList, setResultList] = useState<EdgeResult[]>()
  console.log(dataResults);

  useEffect(() => {
    if (semester && dataResults?.allResults?.edges?.length) {
      const fil = dataResults?.allResults?.edges.filter((item: EdgeResult) => item.node?.course?.semester === semester)
      setResultList(fil)
    }
  }, [semester])


  return (
    <ScrollView style={styles.container}>
      <Header placeholder="" />

      <View>
        <select
          onChange={(e: any) => setSemester(e.target.value)}
        >
          {["---------------", "I", "II"].map((item: string) => <option key={item} value={item}>{item}</option>)}
        </select>
      </View>

      {!searchResults ?
        <DisplayResults
          title="CONTINUOUS ASSESSMENT RESULTS"
          result_type="ca"
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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
});

const GET_RESULTS = gql`
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
          publishCa
          publishExam
          publishResit
        }
      }
    }
  }
`;
