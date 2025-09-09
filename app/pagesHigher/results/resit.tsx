import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
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
import DisplayResults from "./DisplayResults";


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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <AppHeader showBack  showTitle  />

      <View style={styles.dropdownWrapper}>
  <Picker
    selectedValue={semester}
    onValueChange={(value) => setSemester(value)}
    style={styles.picker}  
    itemStyle={styles.pickerItem}       
    dropdownIconColor={COLORS.primary}
  >
    <Picker.Item label="Select semester" value={null} style={styles.optionPlaceholder} />
    <Picker.Item label="I" value="I" style={styles.optionItem} />
    <Picker.Item label="II" value="II" style={styles.optionItem} />
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
