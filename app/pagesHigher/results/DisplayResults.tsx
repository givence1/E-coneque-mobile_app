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
                    <Text style={[styles.cell, { flex: 1 }]}>Code</Text>
                    <Text style={[styles.cell, { flex: 4 }]}>Course</Text>
                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>CA</Text>
                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>Status</Text>
                </View>

                {results?.map((item, index) => {
                    const parsedResults = JSON.parse(item.node.infoData)
                    const { ca, exam, resit } = parsedResults;
                    const mark = result_type === "ca" ? ca : result_type === "exam" ? exam : result_type === "resit" ? resit : parsedResults
                    const passLimit = result_type === "ca" ? (campusInfo?.caLimit || 2) / 2 : result_type === "exam" ? (campusInfo?.examLimit || 2) / 2 : result_type === "resit" ? (campusInfo?.resitLimit || 2) / 2 : parsedResults

                    return <View key={index} style={styles.row}>
                        <Text style={[styles.cell, { flex: 1 }]}>{item.node.course.courseCode}</Text>
                        <Text style={[styles.cell, { flex: 4 }]}>{item.node.course.mainCourse.courseName}</Text>
                        <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{mark}</Text>
                        <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                            {mark >= passLimit ? "✅" : "❌"}
                        </Text>
                    </View>
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
        fontWeight: "500",
    },
});