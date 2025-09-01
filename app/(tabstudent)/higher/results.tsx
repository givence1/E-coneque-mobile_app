import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useQuery, gql } from "@apollo/client";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import TabsHeader from "../../../components/TabsHeader";
import COLORS from "../../../constants/colors";

const GET_RESULTS_DATA = gql`
  query GetData($studentId: Decimal!, $schoolInfoId: ID!, $feeId: ID!) {
    allSchoolInfos(id: $schoolInfoId) {
      edges {
        node {
          schoolName
          town
          campus
          address
          telephone
          logoCampus
        }
      }
    }

    allSchoolFees(id: $feeId) {
      edges {
        node {
          id
          platformPaid
          userprofile {
            id
            customuser {
              id
              matricle
              fullName
            }
            specialty {
              academicYear
              level {
                level
              }
              mainSpecialty {
                specialtyName
              }
            }
          }
        }
      }
    }

    allResults(studentId: $studentId) {
      edges {
        node {
          id
          course {
            mainCourse {
              courseName
            }
            semester
            specialty {
              academicYear
            }
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

export default function ResultsScreen({ route }: any) {
  // ✅ Normally you pass these as params from login/session
  const studentId = 1; // Example
  const schoolInfoId = "1"; // Example
  const feeId = "1"; // Example

  const { data, loading, error } = useQuery(GET_RESULTS_DATA, {
    variables: { studentId, schoolInfoId, feeId },
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

  // ✅ Extract data
  const school = data?.allSchoolInfos?.edges?.[0]?.node;
  const fee = data?.allSchoolFees?.edges?.[0]?.node;
  const student = fee?.userprofile;
  const results = data?.allResults?.edges?.map((e: any) => e.node) || [];

  const semester1 = results.filter((r: any) => r.course.semester === 1);
  const semester2 = results.filter((r: any) => r.course.semester === 2);

  // ✅ Compute total and grade
  const getTotalAndGrade = (ca: number, exam: number, resit: number) => {
    let total = (ca || 0) + (resit !== null ? resit : exam || 0);
    let grade = "-";

    if (total >= 80) grade = "A";
    else if (total >= 70) grade = "B+";
    else if (total >= 60) grade = "B";
    else if (total >= 55) grade = "C+";
    else if (total >= 50) grade = "C";
    else if (total >= 45) grade = "D+";
    else if (total >= 40) grade = "D";
    else grade = "F";

    return { total, grade };
  };

  const renderTable = (data: any[], semesterTitle: string) => (
    <View style={styles.tableContainer}>
      <Text style={styles.semesterTitle}>{semesterTitle} - Result Slip</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.cellHeader}>Course Name</Text>
        <Text style={styles.cellHeader}>CA</Text>
        <Text style={styles.cellHeader}>Exam</Text>
        <Text style={styles.cellHeader}>Resit</Text>
        <Text style={styles.cellHeader}>Total</Text>
        <Text style={styles.cellHeader}>Grade</Text>
      </View>
      {data.map((r: any) => {
        const { total, grade } = getTotalAndGrade(
          r.publishCa,
          r.publishExam,
          r.publishResit
        );
        return (
          <View key={r.id} style={styles.tableRow}>
            <Text style={styles.cell}>{r.course.mainCourse.courseName}</Text>
            <Text style={styles.cell}>{r.publishCa ?? "-"}</Text>
            <Text style={styles.cell}>{r.publishExam ?? "-"}</Text>
            <Text style={styles.cell}>{r.publishResit ?? "-"}</Text>
            <Text style={styles.cell}>{total}</Text>
            <Text style={styles.cell}>{grade}</Text>
          </View>
        );
      })}
    </View>
  );

  // ✅ Generate PDF/Print slip
  const generateHTML = () => {
    const makeTable = (semData: any, title: string) => `
      <h2>${title} - Result Slip</h2>
      <table border="1" cellspacing="0" cellpadding="6" width="100%">
        <tr>
          <th>Course Name</th>
          <th>CA</th>
          <th>Exam</th>
          <th>Resit</th>
          <th>Total</th>
          <th>Grade</th>
        </tr>
        ${semData
          .map((r: any) => {
            const { total, grade } = getTotalAndGrade(
              r.publishCa,
              r.publishExam,
              r.publishResit
            );
            return `
              <tr>
                <td>${r.course.mainCourse.courseName}</td>
                <td>${r.publishCa ?? "-"}</td>
                <td>${r.publishExam ?? "-"}</td>
                <td>${r.publishResit ?? "-"}</td>
                <td>${total}</td>
                <td>${grade}</td>
              </tr>
            `;
          })
          .join("")}
      </table>
    `;

    return `
      <html>
        <body>
          <h1 style="text-align:center;">${school?.schoolName}</h1>
          <p style="text-align:center;">Town: ${school?.town} | Campus: ${school?.campus}</p>
          <p style="text-align:center;">Tel: ${school?.telephone}</p>
          <br/>
          <h3>Student Name: ${student?.customuser?.fullName}</h3>
          <p>Matricule: ${student?.customuser?.matricle}</p>
          <p>Specialty: ${student?.specialty?.mainSpecialty?.specialtyName} |
             Level: ${student?.specialty?.level?.level} |
             Academic Year: ${student?.specialty?.academicYear}</p>
          ${makeTable(semester1, "Semester I")}
          <br/>
          ${makeTable(semester2, "Semester II")}
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    try {
      await Print.printAsync({ html: generateHTML() });
    } catch (err) {
      Alert.alert("Error", "Unable to print");
    }
  };

  const handleDownload = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: generateHTML() });
      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert("Error", "Unable to download");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TabsHeader />
      <ScrollView contentContainerStyle={styles.container}>
        {/* School Header */}
        {school?.logoCampus ? (
          <Image source={{ uri: school.logoCampus }} style={styles.logo} />
        ) : null}
        <Text style={styles.schoolTitle}>{school?.schoolName}</Text>
        <Text style={styles.subHeader}>
          Town: {school?.town} | Campus: {school?.campus}
        </Text>
        <Text style={styles.subHeader}>Tel: {school?.telephone}</Text>

        {/* Student Info */}
        <Text style={styles.studentInfo}>
          {student?.customuser?.fullName} - Matricule:{" "}
          {student?.customuser?.matricle}
        </Text>
        <Text style={styles.studentInfo}>
          {student?.specialty?.mainSpecialty?.specialtyName} | Level:{" "}
          {student?.specialty?.level?.level} | Academic Year:{" "}
          {student?.specialty?.academicYear}
        </Text>

        {/* Tables */}
        {renderTable(semester1, "Semester I")}
        {renderTable(semester2, "Semester II")}

        {/* Actions */}
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
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 8,
  },
  schoolTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.primary,
  },
  subHeader: {
    textAlign: "center",
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  studentInfo: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  semesterTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginVertical: 10,
    textAlign: "center",
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
    fontSize: 12,
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
