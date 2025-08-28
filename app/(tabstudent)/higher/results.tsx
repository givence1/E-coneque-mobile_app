import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useQuery, gql } from "@apollo/client";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import TabsHeader from "../../../components/TabsHeader";
import COLORS from "../../../constants/colors";

const GET_RESULTS = gql`
  query GetData($studentId: Decimal!) {
    allResults(studentId: $studentId) {
      edges {
        node {
          id
          course {
            courseCode
            mainCourse {
              courseName
            }
            semester
            specialty {
              academicYear
            }
          }
          publishCa
          publishExam
          publishResit
        }
      }
    }
  }
`;

export default function ResultsScreen({ route }: any) {
  const studentId = 1; // ✅ Replace with logged-in student ID dynamically

  const { data, loading, error } = useQuery(GET_RESULTS, {
    variables: { studentId },
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading results...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error loading results 😔</Text>
      </View>
    );
  }

  const results = data?.allResults?.edges?.map((edge: any) => edge.node) || [];

  const semester1 = results.filter((r: any) => r.course.semester === 1);
  const semester2 = results.filter((r: any) => r.course.semester === 2);

  // ✅ Format status
  const getStatus = (ca: any, exam: any, resit: any) => {
    if (resit !== null) return "Resit Published";
    if (exam !== null) return "Exam Published";
    if (ca !== null) return "CA Published";
    return "Pending";
  };

  // ✅ Generate HTML for printing / download
  const generateHTML = () => {
    const makeTable = (semData: any, title: string) => `
      <h2>${title}</h2>
      <table border="1" cellspacing="0" cellpadding="6" width="100%">
        <tr>
          <th>Code</th>
          <th>Course</th>
          <th>CA</th>
          <th>Exam</th>
          <th>Resit</th>
          <th>grade</th>
        </tr>
        ${semData
          .map(
            (r: any) => `
          <tr>
            <td>${r.course.courseCode}</td>
            <td>${r.course.mainCourse.courseName}</td>
            <td>${r.publishCa ?? "-"}</td>
            <td>${r.publishExam ?? "-"}</td>
            <td>${r.publishResit ?? "-"}</td>
            <td>${getStatus(r.publishCa, r.publishExam, r.publishResit)}</td>
          </tr>
        `
          )
          .join("")}
      </table>
    `;

    return `
      <html>
      <body>
        <h1>My Results</h1>
        ${makeTable(semester1, "Semester I")}
        <br/>
        ${makeTable(semester2, "Semester II")}
      </body>
      </html>
    `;
  };

  // ✅ Print
  const handlePrint = async () => {
    try {
      await Print.printAsync({ html: generateHTML() });
    } catch (err) {
      Alert.alert("Error", "Unable to print");
    }
  };

  // ✅ Download & Share PDF
  const handleDownload = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: generateHTML(),
      });
      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert("Error", "Unable to download");
    }
  };

  const renderTable = (data: any[], semesterTitle: string) => (
    <View style={styles.tableContainer}>
      <Text style={styles.semesterTitle}>{semesterTitle}</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.cellHeader}>Code</Text>
        <Text style={styles.cellHeader}>Course</Text>
        <Text style={styles.cellHeader}>CA</Text>
        <Text style={styles.cellHeader}>Exam</Text>
        <Text style={styles.cellHeader}>Resit</Text>
        <Text style={styles.cellHeader}>Grade</Text>
      </View>
      {data.map((r: any) => (
        <View key={r.id} style={styles.tableRow}>
          <Text style={styles.cell}>{r.course.courseCode}</Text>
          <Text style={styles.cell}>{r.course.mainCourse.courseName}</Text>
          <Text style={styles.cell}>{r.publishCa ?? "-"}</Text>
          <Text style={styles.cell}>{r.publishExam ?? "-"}</Text>
          <Text style={styles.cell}>{r.publishResit ?? "-"}</Text>
          <Text style={styles.cell}>
            {getStatus(r.publishCa, r.publishExam, r.publishResit)}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TabsHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>My Results</Text>
        {renderTable(semester1, "Semester I")}
        {renderTable(semester2, "Semester II")}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleDownload}>
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePrint}>
            <Text style={styles.buttonText}>Print</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  semesterTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginVertical: 10,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: COLORS.cardBackground,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: COLORS.border,
    padding: 8,
  },
  cellHeader: {
    flex: 1,
    fontWeight: "700",
    fontSize: 13,
    color: "#fff",
  },
  cell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
