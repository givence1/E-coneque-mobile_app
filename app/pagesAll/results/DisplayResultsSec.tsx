import COLORS from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { decodeUrlID } from '@/utils/functions';
import { EdgeResultSecondary, NodePublishSecondary } from '@/utils/schemas/interfaceGraphqlSecondary';
import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';


const DisplayResultsSec = (
    { result_type, results, sequence, term, title, annual }:
        {
            result_type: "sequence" | "term" | "annual", results: EdgeResultSecondary[] | undefined, term: "term_1" | "term_2" | "term_3" | null,
            sequence: "seq_1" | "seq_2" | "seq_3" | "seq_4" | "seq_5" | "seq_6" | null, title: string, annual: boolean
        }
) => {
    const { t } = useTranslation();
    const { section, campusInfo, profileId } = useAuthStore();
    const [statusPlatform, setStatusPlatform] = useState<boolean>(false)
    const [statusFees, setStatusFees] = useState<boolean>(false)
    const [statusPublish, setStatusPublish] = useState<boolean>(false)

    const { data: dataFees, loading: loadingFees } = useQuery(GET_FEES, {
        variables: { userprofileId: profileId },
    });

    useEffect(() => {
        if (dataFees?.allSchoolFeesSec.edges?.length || dataFees?.allSchoolFeesPrim.edges?.length) {
            const fees: any = section === "secondary" ? dataFees?.allSchoolFeesSec.edges[0]?.node :
                section === "primary" ? dataFees?.allSchoolFeesPrim.edges[0]?.node :
                    dataFees?.allSchoolFeesVoc.edges[0]?.node;
            const tuition: number = section === "secondary" ? fees?.userprofilesec?.classroomsec?.tuition :
                section === "primary" ? fees?.userprofileprim?.classroomprim?.tuition :
                    fees?.userprofile?.specialty?.tuition;
            const balance: number = fees?.balance;
            const paid: number = tuition > 0 ? (tuition - balance) / (tuition) : 0;

            let feesControl = (fees?.userprofilesec?.classroomsec?.school?.schoolfeesControl || fees?.userprofileprim?.classroomprim?.school?.schoolfeesControl)
                ?.split(', ')
                .map(Number)
                .filter((item: any) => !isNaN(item)) || [];

            let tuitionControl: number = 1;

            if (sequence === 'seq_1') {
                tuitionControl = feesControl[0];
            } else if (sequence === 'seq_2' || term === "term_1") {
                tuitionControl = feesControl[1];
            } else if (sequence === 'seq_3') {
                tuitionControl = feesControl[2];
            } else if (sequence === 'seq_4' || term === "term_2") {
                tuitionControl = feesControl[3];
            } else if (sequence === 'seq_5') {
                tuitionControl = feesControl[4];
            } else if (sequence === 'seq_6' || term === "term_3" || annual) {
                tuitionControl = feesControl[5];
            } else if (annual) {
                tuitionControl = feesControl[5];
            }
            console.log(paid, 59);

            setStatusPlatform(fees.platformPaid);
            setStatusFees(paid >= tuitionControl);
        }
    }, [dataFees, sequence, term, result_type]);

    const [getPublish, { data: dataPublish, loading: loadingPublish }] = useLazyQuery(GET_PUBLISH);
    console.log(results);
    useEffect(() => {
        if (!dataPublish && (dataFees?.allSchoolFeesSec?.edges?.length || dataFees?.allSchoolFeesPrim?.edges?.length) && (sequence || term)) {
            const prof: any = section === "secondary" ? dataFees?.allSchoolFeesSec.edges[0]?.node?.userprofilesec : dataFees?.allSchoolFeesPrim.edges[0]?.node?.userprofileprim
            getPublish({
                variables: {
                    classroomId: parseInt(decodeUrlID(prof?.classroomsec?.id || prof?.classroomprim?.id) || "0"),
                },
            });
        }
        if (dataPublish && (dataFees?.allSchoolFeesSec?.edges?.length || dataFees?.allSchoolFeesPrim?.edges?.length) && (sequence || term)) {
            const pub: NodePublishSecondary = section === "secondary" ? dataPublish?.allPublishSec?.edges[0]?.node : dataPublish?.allPublishPrim?.edges[0]?.node

            const pubStates = JSON.parse(pub?.publishSeq || "{}")
            setStatusPublish(pubStates[sequence || ""])
        }
    }, [dataFees, dataPublish, sequence]);

    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            {/* <Text style={styles.title}>{t("results.sequence")} - {sequence?.replace("_", " ").toUpperCase()}</Text> */}

            <View style={styles.table}>
                <View style={styles.rowHeader}>
                    <Text style={[styles.headercell, { flex: result_type === "annual" ? 6 : result_type === "term" ? 5 : 4 }]}>{t("results.subject")}</Text>
                    {result_type === "sequence" ?
                        <>
                            <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>{sequence?.toUpperCase()}</Text>
                            <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>{t("results.status")}</Text>
                        </>
                        : result_type === "term" ?
                            <>
                                <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>{term === "term_1" ? "S1" : term === "term_2" ? "S3" : "S5"}</Text>
                                <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>{term === "term_1" ? "S2" : term === "term_2" ? "S4" : "S6"}</Text>
                                <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>{t("results.status")}</Text>
                            </>
                            :
                            result_type === "annual" ?
                                <>
                                    <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>T1</Text>
                                    <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>T2</Text>
                                    <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>T3</Text>
                                    <Text style={[styles.headercell, { flex: 1, textAlign: "center" }]}>{t("results.status")}</Text>
                                </>
                                :
                                null
                    }
                </View>

                {
                    loadingFees || loadingPublish ?
                        <ActivityIndicator />
                        :
                        !statusPlatform ?
                            <Text style={{ textAlign: "center", paddingVertical: 5, marginVertical: 30, color: "red", fontWeight: 500, fontSize: 16 }}>{t("results.accountNotActive")}</Text>
                            :
                            !statusFees ?
                                <Text style={{ textAlign: "center", paddingVertical: 5, marginVertical: 30, color: "red", fontWeight: 500, fontSize: 16 }}>{t("results.schoolFees")}</Text>
                                :
                                !statusPublish ?
                                    <Text style={{ textAlign: "center", paddingVertical: 5, marginVertical: 30, color: "red", fontWeight: 500, fontSize: 16 }}>{t("results.resultsNotPublished")}</Text>
                                    :
                                    results &&
                                    // results?
                                    // .sort((a: EdgeResultSecondary, b: EdgeResultSecondary) => a.node.subjectsec?.mainsubject.subjectName > b.node.subjectsec?.mainsubject.subjectName ? 1 : a.node.subjectsec?.mainsubject?.subjectName < b.node.subjectsec?.mainsubject?.subjectName ? -1 : 0)
                                    results.map((item, index) => {
                                        const parsedResults = JSON.parse(item.node.infoData)
                                        const { seq_1, seq_2, seq_3, seq_4, seq_5, seq_6 } = parsedResults;
                                        const { av_term_1, av_term_2, av_term_3 } = parsedResults;
                                        const { av_annual } = parsedResults;
                                        const { grade_1, grade_2, grade_3 } = parsedResults;

                                        if (result_type === "sequence") {
                                            const seqPassLimit = (campusInfo?.seqLimit || 20) / 2;

                                            const overallPassed = sequence === "seq_1" ? seq_1 >= seqPassLimit :
                                                sequence === "seq_2" ? seq_2 >= seqPassLimit :
                                                    sequence === "seq_3" ? seq_3 >= seqPassLimit :
                                                        sequence === "seq_4" ? seq_4 >= seqPassLimit :
                                                            sequence === "seq_5" ? seq_5 >= seqPassLimit : seq_6 >= seqPassLimit

                                            return (
                                                <View key={index} style={styles.row}>
                                                    <Text style={[styles.cell, { flex: 4 }]}>{item.node.subjectsec?.mainsubject?.subjectName}</Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {
                                                            sequence === "seq_1" ? seq_1 :
                                                                sequence === "seq_2" ? seq_2 :
                                                                    sequence === "seq_3" ? seq_3 :
                                                                        sequence === "seq_4" ? seq_4 :
                                                                            sequence === "seq_5" ? seq_5 : seq_6
                                                        }
                                                    </Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {overallPassed ? t("results.pass") : t("results.fail")}
                                                    </Text>
                                                </View>
                                            );
                                        } else if (result_type === "term") {
                                            const seqPassLimit = (campusInfo?.seqLimit || 20) / 2;
                                            const overallPassed = term === "term_1" ? av_term_1 >= seqPassLimit :
                                                term === "term_2" ? av_term_2 >= seqPassLimit : av_term_3 >= seqPassLimit

                                            return (
                                                <View key={index} style={styles.row}>
                                                    <Text style={[styles.cell, { flex: 5 }]}>{item.node.subjectsec?.mainsubject?.subjectName}</Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {
                                                            term === "term_1" ? seq_1 :
                                                                term === "term_2" ? seq_3 : seq_5
                                                        }
                                                    </Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {
                                                            term === "term_1" ? seq_2 :
                                                                term === "term_2" ? seq_4 : seq_6
                                                        }
                                                    </Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center", gap: 10 }]}>
                                                        {
                                                            term === "term_1" ? av_term_1 :
                                                                term === "term_2" ? av_term_2 : av_term_3
                                                        }
                                                        -
                                                        {/* {overallPassed ? t("results.pass") : t("results.fail")} */}
                                                        <Text style={{ fontStyle: "italic", color: `${overallPassed ? "green" : "red"}` }}>
                                                            {
                                                                term === "term_1" ? grade_1 :
                                                                    term === "term_2" ? grade_2 : grade_3
                                                            }
                                                        </Text>
                                                    </Text>
                                                </View>
                                            );
                                        } else if (result_type === "annual") {
                                            const seqPassLimit = (campusInfo?.seqLimit || 20) / 2;
                                            const overallPassed = av_annual >= seqPassLimit;

                                            return (
                                                <View key={index} style={styles.row}>
                                                    <Text style={[styles.cell, { flex: 6 }]}>{item.node.subjectsec?.mainsubject?.subjectName}</Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {av_term_1}
                                                    </Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {av_term_2}
                                                    </Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {av_term_3}
                                                    </Text>
                                                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                                                        {overallPassed ? t("results.pass") : t("results.fail")}
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

export default DisplayResultsSec;

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
        borderRadius: 8,
        borderColor: COLORS.border,
        width: "100%"
    },
    rowHeader: {
        flexDirection: "row",
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 8,
    },
    row: {
        flexDirection: "row",
        padding: 10,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    headercell: {
        color: COLORS.white,
        paddingRight: 1,
        fontWeight: "500",
        justifyContent: "space-between"
    },
    cell: {
        color: COLORS.black,
        paddingRight: 1,
        fontWeight: "500",
        justifyContent: "space-between"
    },
});


const GET_FEES = gql`
  query GetData (
    $userprofileId: Decimal!
) {
    allSchoolFeesSec (userprofilesecId: $userprofileId) {
        edges {
            node {
                id platformPaid balance
                userprofilesec {
                    classroomsec { id tuition school { schoolfeesControl }}
                }
            }
        }
    }
    allSchoolFeesPrim (userprofileprimId: $userprofileId) {
        edges {
            node {
                id platformPaid balance
                userprofileprim {
                    classroomprim { id tuition school { schoolfeesControl }}
                }
            }
        }
    }
}`;

const GET_PUBLISH = gql`
    query GetData (
        $classroomId: Decimal!
    ) {
        allPublishSec (
            classroomsecId: $classroomId
        ) {
            edges {
                node {
                    id publishSeq
                    classroomsec {
                        level academicYear classType
                        series { name }
                    }
                }
            }
        }
    }`
    ;