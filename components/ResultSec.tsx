import DisplayResultsSec from "@/app/pagesAll/results/DisplayResultsSec";
import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { capitalizeFirstLetter } from "@/utils/functions";
import { gql, useQuery } from "@apollo/client";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";


const ResultSec = (
    { result_type }:
        { result_type: "sequence" | "term" | "annual" }
) => {
    const { t } = useTranslation();
    const [sequence, setSequence] = useState<"seq_1" | "seq_2" | "seq_3" | "seq_4" | "seq_5" | "seq_6" | null>(null);
    const [term, setTerm] = useState<"term_1" | "term_2" | "term_3" | null>(null);
    const { section, profileId } = useAuthStore();

    const { data: dataResults, loading: searchResults } = useQuery(GET_RESULTS, {
        variables: {
            studentId: profileId,
        },
    });

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            {/* ✅ Fixed header outside the ScrollView */}
            <AppHeader showBack showTitle />

            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.scrollContent, { paddingTop: 65 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* ✅ Semester Picker */}
                {result_type !== "annual" ? <View style={styles.dropdownWrapper}>
                    <Picker
                        selectedValue={result_type === "sequence" ? sequence : term}
                        onValueChange={(value: any) => result_type === "sequence" ? setSequence(value) : setTerm(value)}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                        dropdownIconColor={COLORS.primary}
                    >
                        <Picker.Item
                            label={result_type === "sequence" ? t("results.selectSequence") : t("results.selectTerm")}
                            value={null}
                            style={styles.optionPlaceholder}
                        />

                        {result_type === "sequence" ?
                            <>
                                <Picker.Item
                                    label={t("results.sequence1")} value="seq_1" style={styles.optionItem}
                                />
                                <Picker.Item
                                    label={t("results.sequence2")} value="seq_2" style={styles.optionItem}
                                />
                                <Picker.Item
                                    label={t("results.sequence3")} value="seq_3" style={styles.optionItem}
                                />
                                <Picker.Item
                                    label={t("results.sequence4")} value="seq_4" style={styles.optionItem}
                                />
                                <Picker.Item
                                    label={t("results.sequence5")} value="seq_5" style={styles.optionItem}
                                />
                                <Picker.Item
                                    label={t("results.sequence6")} value="seq_6" style={styles.optionItem}
                                />
                            </> : null}

                        {result_type === "term" ?
                            <>
                                <Picker.Item
                                    label={t("results.term1")} value="term_1" style={styles.optionItem}
                                />
                                <Picker.Item
                                    label={t("results.term2")} value="term_2" style={styles.optionItem}
                                />
                                <Picker.Item
                                    label={t("results.term3")} value="term_3" style={styles.optionItem}
                                />
                            </> : null}
                    </Picker>
                </View> : null}

                {/* ✅ Results or Loading */}
                {!searchResults ? (sequence || term || result_type === "annual") ?
                    <DisplayResultsSec
                        title={result_type === "sequence" ? t("results.sequenceTitle") : result_type === "term" ? t("results.termTitle") : t("results.annualTitle")}
                        result_type={result_type}
                        results={section === "secondary" ? dataResults?.allResultsSec?.edges : dataResults?.allResultsPrim?.edges}
                        sequence={result_type === "sequence" ? sequence : null}
                        term={result_type === "term" ? term : null}
                        annual={result_type === "annual"}
                    />
                    :
                    <View>
                        <Text>Select {capitalizeFirstLetter(result_type)}</Text>
                    </View>
                    :
                    <View style={{ marginVertical: 25 }}>
                        <ActivityIndicator size="large" />
                    </View>
                }
            </ScrollView>
        </View>
    );
}

export default ResultSec

const GET_RESULTS = gql`
  query GetData($studentId: Decimal!) {
    allResultsSec(
      studentId: $studentId
    ) {
      edges {
        node {
          id
          student {
            customuser {
              matricle
              preinscriptionStudent {
                fullName
              }
            }
          }
          subjectsec {
            mainsubject {
              subjectName
              subjectCode
            }
          }
          infoData
        }
      }
    }
  }
`;



const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: 16, borderRadius: 50 },
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
