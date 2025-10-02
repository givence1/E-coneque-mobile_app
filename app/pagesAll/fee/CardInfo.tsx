import COLORS from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

const CardInfo = (
    {fees, progress, totalPaid }:
    {fees: any, progress: number, totalPaid: number }
) => {

    const { t } = useTranslation();

    return (
        <>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons
                        name="person-circle"
                        size={28}
                        color={COLORS.primary}
                    />
                    <Text style={styles.cardTitle}>
                        {fees?.userprofile?.customuser?.preinscriptionStudent?.fullName}
                        {fees?.userprofilesec?.customuser?.preinscriptionStudent?.fullName}
                        {fees?.userprofileprim?.customuser?.preinscriptionStudent?.fullName}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>{t("fees.matricule")}:</Text>
                    <Text style={styles.value}>
                        {fees?.userprofile?.customuser?.matricle}
                        {fees?.userprofilesec?.customuser?.matricle}
                        {fees?.userprofileprim?.customuser?.matricle}
                    </Text>
                </View>
                {fees.userprofile?.specialty ? <View style={styles.row}>
                    <Text style={styles.label}>{t("fees.specialty")}:</Text>
                    <Text style={styles.value}>
                        {fees?.userprofile?.specialty?.mainSpecialty?.specialtyName}
                    </Text>
                </View> : null}
                <View style={styles.row}>
                    <Text style={styles.label}>{t("fees.level")}:</Text>
                    <Text style={styles.value}>
                        {fees?.userprofile?.specialty?.level?.level}
                        {fees?.userprofilesec?.classroomsec?.level}
                        {fees?.userprofilesec?.classroomprim?.level}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{t("fees.academicYear")}:</Text>
                    <Text style={styles.value}>
                        {fees.userprofile?.specialty?.academicYear}
                        {fees.userprofilesec?.classroomsec?.academicYear}
                        {fees.userprofilesec?.classroomprim?.academicYear}
                    </Text>
                </View>
            </View>

            {/* Tuition & Payments Card */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t("fees.tuition")}</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>{t("fees.tuition")}:</Text>
                    <Text style={styles.value}>
                        {fees?.userprofile ? fees?.userprofile?.specialty?.tuition?.toLocaleString() + " F" : null}
                        {fees?.userprofilesec ? fees?.userprofilesec?.classroomsec?.tuition?.toLocaleString() + " F" : null}
                        {fees?.userprofileprim ? fees?.userprofileprim?.classroomprim?.tuition?.toLocaleString() + " F" : null}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{t("fees.payment1")}:</Text>
                    <Text style={styles.value}>
                        {fees?.userprofile ? fees?.userprofile?.specialty?.paymentOne?.toLocaleString() + " F" : null}
                        {fees?.userprofilesec ? fees?.userprofilesec?.classroomsec?.paymentOne?.toLocaleString() + " F" : null}
                        {fees?.userprofileprim ? fees?.userprofileprim?.classroomprim?.paymentOne?.toLocaleString() + " F" : null}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{t("fees.payment2")}:</Text>
                    <Text style={styles.value}>
                        {fees?.userprofile ? fees?.userprofile?.specialty?.paymentTwo?.toLocaleString() + " F" : null}
                        {fees?.userprofilesec ? fees?.userprofilesec?.classroomsec?.paymentTwo?.toLocaleString() + " F" : null}
                        {fees?.userprofileprim ? fees?.userprofileprim?.classroomprim?.paymentTwo?.toLocaleString() + " F" : null}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>{t("fees.payment3")}:</Text>
                    <Text style={styles.value}>
                        {fees?.userprofile ? fees?.userprofile?.specialty?.paymentThree?.toLocaleString() + " F" : null}
                        {fees?.userprofilesec ? fees?.userprofilesec?.classroomsec?.paymentThree?.toLocaleString() + " F" : null}
                        {fees?.userprofileprim ? fees?.userprofileprim?.classroomprim?.paymentThree?.toLocaleString() + " F" : null}
                    </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View
                        style={[styles.progressBar, { width: `${progress}%` }]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {totalPaid.toLocaleString()} F /{" "}
                    {(fees?.userprofile?.specialty?.tuition || fees?.userprofilesec?.classroomsec?.tuition || fees?.userprofileprim?.classroomprim?.tuition)?.toLocaleString()} F
                </Text>
            </View>
        </>
    );
}

export default CardInfo;


const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 8,
        color: COLORS.textDark,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    progressBar: {
        height: 8,
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: COLORS.textPrimary,
        textAlign: "right",
        marginBottom: 6,
    },
    progressContainer: {
        height: 8,
        backgroundColor: "#eee",
        borderRadius: 4,
        marginVertical: 6,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
        color: COLORS.textDark,
    },
    label: { fontSize: 14, fontWeight: "500", color: COLORS.textPrimary },
    value: { fontSize: 14, color: COLORS.textDark },
})
