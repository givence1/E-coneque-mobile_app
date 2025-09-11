import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { EdgeResult } from '@/utils/schemas/interfaceGraphql';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DisplayResults = (
  { result_type, results, semester, title }:
    { result_type: "ca" | "exam" | "resit" | "results", results: EdgeResult[] | undefined, semester: "I" | "II" | null, title: string }
) => {
  const { campusInfo } = useAuthStore();

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Semester {semester}</Text>

      <View style={styles.table}>
        {/* HEADER */}
        <View style={styles.rowHeader}>
          <Text style={[styles.headerCell, { flex: 2 }]}>Course Name</Text>
          {result_type === "results" ? (
            <>
              <Text style={[styles.headerCell, { flex: 1 }]}>CA</Text>
              <Text style={[styles.headerCell, { flex: 1 }]}>Exam</Text>
              <Text style={[styles.headerCell, { flex: 1 }]}>Resit</Text>
              <Text style={[styles.headerCell, { flex: 1 }]}>Status</Text>
            </>
          ) : (
            <>
              <Text style={[styles.headerCell, { flex: 1 }]}>{result_type.toUpperCase()}</Text>
              <Text style={[styles.headerCell, { flex: 1 }]}>Status</Text>
            </>
          )}
        </View>

        {/* DATA ROWS */}
        {results?.sort((a: EdgeResult, b: EdgeResult) =>
          a.node.course.mainCourse.courseName.localeCompare(b.node.course.mainCourse.courseName)
        )?.map((item, index) => {
          const parsedResults = JSON.parse(item.node.infoData || "{}");
          const { ca, exam, resit } = parsedResults;

          if (result_type === "results") {
            const caPassLimit = (campusInfo?.caLimit || 30) / 2;
            const examPassLimit = (campusInfo?.examLimit || 40) / 2;
            const resitPassLimit = (campusInfo?.resitLimit || 40) / 2;
            const overallPassed = ca >= caPassLimit || exam >= examPassLimit || resit >= resitPassLimit;

            return (
              <View key={index} style={styles.row}>
                <Text style={[styles.cellLeft, { flex: 3 }]}>
                  {item.node.course.mainCourse.courseName}
                </Text>
                <Text style={[styles.cell, { flex: 1 }]}>{ca}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>{exam}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>{resit || "-"}</Text>
                <Text style={[
                  styles.cell,
                  { flex: 1, color: overallPassed ? COLORS.success : COLORS.error }
                ]}>
                  {overallPassed ? "Pass" : "Fail"}
                </Text>
              </View>
            );
          } 
          
          if (result_type === "resit") {
            const passLimit = (campusInfo?.resitLimit || 40) / 2;
            const published = item.node.publishResit;
            let displayMark = "-";
            let status = "No Resit";
            let statusColor = COLORS.textSecondary;

            if (!published && resit) {
              status = "Pending";
              statusColor = COLORS.warning;
            } else if (published && resit) {
              displayMark = resit;
              const passed = resit >= passLimit;
              status = passed ? "Pass" : "Fail";
              statusColor = passed ? COLORS.success : COLORS.error;
            }

            return (
              <View key={index} style={styles.row}>
                <Text style={[styles.cellLeft, { flex: 5 }]}>
                  {item.node.course.mainCourse.courseName}
                </Text>
                <Text style={[styles.cell, { flex: 2 }]}>{displayMark}</Text>
                <Text style={[
                  styles.cell,
                  { flex: 1, color: statusColor }
                ]}>
                  {status}
                </Text>
              </View>
            );
          }

          // CA / EXAM (default)
          const mark = result_type === "ca" ? ca : exam;
          const passLimit = result_type === "ca" ? (campusInfo?.caLimit || 30) / 2 : (campusInfo?.examLimit || 40) / 2;

          return (
            <View key={index} style={styles.row}>
              <Text style={[styles.cellLeft, { flex: 5 }]}>
                {item.node.course.mainCourse.courseName}
              </Text>
              <Text style={[styles.cell, { flex: 2 }]}>{mark}</Text>
              <Text style={[
                styles.cell,
                { flex: 1, color: mark >= passLimit ? COLORS.success : COLORS.error }
              ]}>
                {mark >= passLimit ? "Pass" : "Fail"}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default DisplayResults;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    overflow: "hidden",
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  headerCell: {
    color: COLORS.white,
    fontWeight: "700",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  cell: {
    fontSize: 14,
    color: COLORS.textDark,
    textAlign: "left",
  },
  cellLeft: {
    fontSize: 14,
    color: COLORS.textDark,
    textAlign: "left",
  },
});
