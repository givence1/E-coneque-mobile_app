import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { decodeUrlID } from '@/utils/functions';
import { EdgeResult, NodePublish, NodeSchoolFees, NodeUserProfile } from '@/utils/schemas/interfaceGraphql';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const DisplayResults = (
    { result_type, results, semester, title }:
        { result_type: "ca" | "exam" | "resit" | "results", results: EdgeResult[] | undefined, semester: "I" | "II" | null, title: string }
) => {
    const { campusInfo, profileId } = useAuthStore();
    const [statusPlatform, setStatusPlatform] = useState<boolean>(false)
    const [statusFees, setStatusFees] = useState<boolean>(false)
    const [statusPublish, setStatusPublish] = useState<boolean>(false)

    const { data: dataFees, loading: loadingFees } = useQuery(GET_FEES, {
        variables: { userprofileId: profileId },
    });

    useEffect(() => {
        if (dataFees?.allSchoolFees.edges?.length) {
            const fees: NodeSchoolFees = dataFees?.allSchoolFees.edges[0]?.node;
            const tuition: number = fees?.userprofile?.specialty?.tuition;
            const balance: number = fees?.balance;
            const paid: number = tuition > 0 ? (tuition - balance) / (tuition) : 0;

            let feesControl = fees?.userprofile?.specialty?.school?.schoolfeesControl
                ?.split(', ')
                .map(Number)
                .filter(item => !isNaN(item)) || [];

            let semesterControl: number[] = [];
            if (semester === 'I') {
                semesterControl = feesControl.slice(0, 3);
            } else if (semester === 'II') {
                semesterControl = feesControl.slice(3, 6);
            }

            let checkPercent = 1;
            if (result_type === "ca" && semesterControl.length > 0) {
                checkPercent = semesterControl[0];
            } else if (result_type === "exam" && semesterControl.length > 1) {
                checkPercent = semesterControl[1];
            } else if (result_type === "resit" && semesterControl.length > 2) {
                checkPercent = semesterControl[2];
            } else if (result_type === "results" && semesterControl.length > 2) {
                checkPercent = semesterControl[2];
            }
            setStatusPlatform(fees.platformPaid);
            setStatusFees(paid >= checkPercent);
        }
    }, [dataFees, semester, result_type]);

    const [getPublish, { data: dataPublish, loading: loadingPublish }] = useLazyQuery(GET_PUBLISH);

    useEffect(() => {
        if (!dataPublish && dataFees?.allSchoolFees.edges?.length && semester) {
            const prof: NodeUserProfile = dataFees?.allSchoolFees.edges[0]?.node?.userprofile
            getPublish({
                variables: {
                    specialtyId: parseInt(decodeUrlID(prof?.specialty?.id) || "0"),
                    semester
                },
            });
        }
        if (dataPublish && dataFees?.allSchoolFees.edges?.length && semester) {
            const pub: NodePublish = dataPublish?.allPublishes?.edges[0]?.node
             
            if (result_type === "ca" && pub?.ca) {
                setStatusPublish(true);
            } else if (result_type === "exam" && pub?.exam) {
                setStatusPublish(true);
            } else if (result_type === "resit" && pub?.resit) {
                setStatusPublish(true);
            } else if (result_type === "results" && pub?.resit) {
                setStatusPublish(true);
            }
        }
    }, [dataFees, dataPublish, semester]);

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

                {
                    loadingFees || loadingPublish ?
                        <ActivityIndicator />
                        :
                        !statusPlatform ?
                            <Text>Account Not Active</Text>
                            :
                            !statusFees ?
                                <Text>School Fees</Text>
                                :
                                !statusPublish ?
                                    <Text>Results Not Published</Text>
                                    :
                                    results?.sort((a: EdgeResult, b: EdgeResult) => a.node.course.mainCourse.courseName > b.node.course.mainCourse.courseName ? 1 : a.node.course.mainCourse.courseName < b.node.course.mainCourse.courseName ? -1 : 0)?.map((item, index) => {
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
                                                    {<Text style={[styles.cell, { flex: 1 }]}>{item.node.course.courseCode}</Text>}
                                                    <Text style={[styles.cell, { flex: 4 }]}>{item.node.course.mainCourse.courseName}</Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>{mark}</Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {mark >= passLimit ? "✅" : "❌"}
                                                    </Text>
                                                </View>
                                            );
                                        }
                                    })
                }

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
        justifyContent: "space-between"
    },
});


const GET_FEES = gql`
  query GetData (
    $userprofileId: Decimal!
  ) {
    allSchoolFees (
        userprofileId: $userprofileId
    ) {
        edges {
            node {
                id platformPaid balance
                userprofile {
                    specialty { id tuition school { schoolfeesControl }}
                }
            }
        }
    }
}`

const GET_PUBLISH = gql`
  query GetData (
    $specialtyId: Decimal!
    $semester: String!
  ) {
    allPublishes (
        specialtyId: $specialtyId
        semester: $semester
    ) {
        edges {
            node {
                id ca exam resit
                specialty { mainSpecialty { specialtyName }}
            }
        }
    }
}`