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
            <Text style={styles.title}>Semester - {semester}</Text>

            <View style={styles.table}>
                <View style={styles.rowHeader}>

                    <Text style={[styles.cell, { flex: 3 }]}>Course</Text>
                    {result_type === "results" ? (
                        <>
                            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>CA</Text>
                            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>Exam</Text>
                            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>Resit</Text>
                            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>Status</Text>
                        </>
                    ) : (
                        <>
                            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{result_type.toUpperCase()}</Text>
                            <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>Status</Text>
                        </>
                    )}
                </View>

                {results?.sort((a: EdgeResult, b: EdgeResult) => a.node.course.mainCourse.courseName > b.node.course.mainCourse.courseName ? 1 : a.node.course.mainCourse.courseName < b.node.course.mainCourse.courseName ? -1 : 0)?.map((item, index) => {
                    const parsedResults = JSON.parse(item.node.infoData)
                    const { ca, exam, resit } = parsedResults;
                    
                    if (result_type === "results") {
                        // Display all result types in one row
                        const caPassLimit = (campusInfo?.caLimit || 20) / 2;
                        const examPassLimit = (campusInfo?.examLimit || 40) / 2;
                        const resitPassLimit = (campusInfo?.resitLimit || 40) / 2;
                        
                        // Determine overall status (pass if any of the results is passing)
                        const overallPassed = ca >= caPassLimit || exam >= examPassLimit || resit >= resitPassLimit;
                        
                        return (
                            <View key={index} style={styles.row}>
                                <Text style={[styles.cell, { flex: 3 }]}>{item.node.course.mainCourse.courseName}</Text>
                                <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{ca}</Text>
                                <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{exam}</Text>
                                <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{resit || "-"}</Text>
                                <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                    {overallPassed ? "✅" : "❌"}
                                </Text>
                            </View>
                        );
                    } else {
                        // Display single result type
                        const mark = result_type === "ca" ? ca :
                            result_type === "exam" ? exam :
                            result_type === "resit" ? resit : 0;
                        
                        const passLimit = result_type === "ca" ? (campusInfo?.caLimit || 20) / 2 :
                            result_type === "exam" ? (campusInfo?.examLimit || 40) / 2 :
                            result_type === "resit" ? (campusInfo?.resitLimit || 40) / 2 : 0;

                        return (
                            <View key={index} style={styles.row}>
                                { <Text style={[styles.cell, { flex: 1 }]}>{item.node.course.courseCode}</Text> }
                                <Text style={[styles.cell, { flex: 4 }]}>{item.node.course.mainCourse.courseName}</Text>
                                <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{mark}</Text>
                                <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                    {mark >= passLimit ? "✅" : "❌"}
                                </Text>
                            </View>
                        );
                    }
                })}
            </View>
        </View>
    );
}

export default DisplayResults;



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
        textAlign: "center",
        marginBottom: 10,
    },
    table: {
        borderWidth: 1,
        borderColor: COLORS.border,
        width: "100%"
    },
    rowHeader: {
        flexDirection: "row",
        backgroundColor: COLORS.primary,
        padding: 10,
    },
    row: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    cell: {
        color: COLORS.textDark,
        paddingRight: 1,
        fontWeight: "500",
        justifyContent:"space-between"
    },
});