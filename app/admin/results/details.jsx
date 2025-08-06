import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import COLORS from "../../../constants/colors";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as Sharing from "expo-sharing";
import Header from "../../../components/Header";

const dummyResult = [
  { course: "OBSTETRIC NURSING II", ca: 20 },
  { course: "INTENSIVE CARE I", ca: 40 },
  { course: "PEDIATRIC PATHOLOGY/NURSING I", ca: 30.5 },
  { course: "CHILDCARE NUTRITION AND DIETETICS", ca: 32 },
  { course: "COMMUNITY NURSING", ca: 32 },
  { course: "MEDICAL SURGICAL NURSING", ca: 30 },
  { course: "OBSTETRIC PATHOLOGIES AND COMPLICATIONS", ca: 31 },
  { course: "OTHER VARIETIES IN CHILD CARE", ca: 32 },
  { course: "OBSTETRIC NURSING I", ca: 20 },
  { course: "DYSTOCIA", ca: 33 },
  { course: "RESEARCH METHODOLOGY I", ca: 25 },
];

export default function ResultDetails() {
  const { id, type, semester, year } = useLocalSearchParams();
  const router = useRouter();

  const handleExportPDF = async () => {
    let htmlContent = `
      <h2>${year} - Semester ${semester} (${type})</h2>
      <table border="1" cellspacing="0" cellpadding="6">
        <tr>
          <th>Course</th>
          <th>CA</th>
          <th>Status</th>
        </tr>
        ${dummyResult
          .map(
            (item) => `
          <tr>
            <td>${item.course}</td>
            <td style="text-align:center">${item.ca}</td>
            <td style="text-align:center">${item.ca >= 30 ? "✅" : "❌"}</td>
          </tr>
        `
          )
          .join("")}
      </table>
    `;

    try {
      const pdf = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `Result_${semester}_${year}`,
        base64: false,
      });

      await Sharing.shareAsync(pdf.filePath);
    } catch (error) {
      Alert.alert("PDF Error", "Failed to generate or share PDF");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Result Details" />
      <Text style={styles.title}>
        {year} - Semester {semester} ({type})
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Course</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: "center" }]}>
              CA
            </Text>
            <Text
              style={[styles.headerText, { flex: 0.6, textAlign: "center" }]}
            >
              Status
            </Text>
          </View>

          {dummyResult.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text
                style={[styles.cell, { flex: 2, maxWidth: 200 }]}
                numberOfLines={0}
              >
                {item.course}
              </Text>
              <Text
                style={[styles.cell, { flex: 1, textAlign: "center" }]}
              >
                {item.ca}
              </Text>
              <Text
                style={[styles.cell, { flex: 0.6, textAlign: "center" }]}
              >
                {item.ca >= 30 ? "✅" : "❌"}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/student/profile/complaint")}
      >
        <Text style={styles.buttonText}>Complain ❗</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.primary }]}
        onPress={handleExportPDF}
      >
        <Text style={styles.buttonText}>Export to PDF 📄</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: COLORS.primary,
    textAlign: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerText: {
    fontWeight: "700",
    color: "white",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cell: {
    color: COLORS.textDark,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  button: {
    backgroundColor: "#FF5A5F",
    padding: 16,
    marginTop: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
});
