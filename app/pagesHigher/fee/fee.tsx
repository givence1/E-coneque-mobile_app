import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { NodeSchoolFees } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // ✅ translation hook
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ModalMoratorium from "../../pagesHigher/fee/ModalMoratorium";

const Fees = () => {
  const { t } = useTranslation();
  const { profileId } = useAuthStore();

  const { data: dataFees, loading, error } = useQuery(GET_DATA, {
    variables: { userprofileId: profileId },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [fees, setFees] = useState<NodeSchoolFees>();
  const [moratoriumStatus, setMoratoriumStatus] = useState(null);

  useEffect(() => {
    if (dataFees?.allSchoolFees?.edges?.length) {
      const f = dataFees?.allSchoolFees?.edges[0];
      setFees(f?.node);
    }
  }, [dataFees]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* ✅ Fixed header */}
      <AppHeader showBack showTitle />

      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        {!loading ? (
          fees?.id ? (
            <ScrollView
              contentContainerStyle={{ padding: 10, paddingTop: 60, paddingBottom: 50 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Student Basic Info */}
              <Text style={styles.title}>{fees?.userprofile?.customuser?.fullName}</Text>
              <Text style={styles.title}>
                {t("fees.matricule")}: {fees?.userprofile?.customuser?.matricle}
              </Text>
              <Text style={styles.subtitle}>
                {t("fees.specialty")}: {fees.userprofile?.specialty?.mainSpecialty?.specialtyName}
              </Text>
              <Text style={styles.caption}>
                {t("fees.academicYear")}: {fees.userprofile?.specialty?.academicYear}
              </Text>

              {/* Fee Info */}
              <View style={styles.section}>
                <Text style={styles.label}>{t("fees.level")}:</Text>
                <Text style={styles.value}>{fees?.userprofile?.specialty?.level?.level}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>{t("fees.tuition")}:</Text>
                <Text style={styles.value}>
                  {fees?.userprofile?.specialty?.tuition?.toLocaleString()} F
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>{t("fees.payment1")}:</Text>
                <Text style={styles.value}>
                  {fees?.userprofile?.specialty?.paymentOne?.toLocaleString()} F
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.label}>{t("fees.payment2")}:</Text>
                <Text style={styles.value}>
                  {fees?.userprofile?.specialty?.paymentTwo?.toLocaleString()} F
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.label}>{t("fees.payment3")}:</Text>
                <Text style={styles.value}>
                  {fees?.userprofile?.specialty?.paymentThree?.toLocaleString()} F
                </Text>
              </View>

              {/* Transactions */}
              <Text style={styles.tableTitle}>{t("fees.transactions")}</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.bold]}>{t("fees.txId")}</Text>
                <Text style={[styles.cell, styles.bold]}>{t("fees.reason")}</Text>
                <Text style={[styles.cell, styles.bold]}>{t("fees.amount")}</Text>
              </View>

              {fees?.transactions?.map((trans) => (
                <View key={trans.id} style={styles.tableRow}>
                  <Text style={styles.cell}>{trans.ref}</Text>
                  <Text style={styles.cell}>{trans.reason}</Text>
                  <Text style={styles.cell}>{trans.amount}</Text>
                </View>
              ))}

              {/* Totals */}
              <View style={styles.section}>
                <Text style={styles.label}>{t("fees.totalPaid")}:</Text>
                <Text style={styles.value}>
                  {(fees?.userprofile?.specialty?.tuition - fees?.balance).toLocaleString()} F
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.label}>{t("fees.balance")}:</Text>
                <Text style={styles.value}>{fees?.balance} F</Text>
              </View>

              {/* Moratorium */}
              {!fees?.moratoires?.length ? (
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.moratoriumButton}
                >
                  <Text style={styles.buttonText}>{t("fees.requestMoratorium")}</Text>
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Text style={{ color: "black" }}>{t("fees.moratorium")}:</Text>
                  <Text style={[styles.buttonText, { color: "green" }]}>
                    {fees?.moratoires[0]?.status}
                  </Text>
                </View>
              )}

              {/* Status */}
              <View style={styles.statusSection}>
                <Text style={styles.statusLabel}>{t("fees.idCard")}:</Text>
                {fees?.idPaid ? (
                  <Ionicons name="checkmark-circle" size={20} color="green" />
                ) : (
                  <Ionicons name="checkmark-circle" size={20} color="red" />
                )}
              </View>
              <View style={styles.statusSection}>
                <Text style={styles.statusLabel}>{t("fees.accountStatus")}:</Text>
                {fees?.platformPaid ? (
                  <Ionicons name="checkmark-circle" size={20} color="green" />
                ) : (
                  <Ionicons name="checkmark-circle" size={20} color="red" />
                )}
              </View>
            </ScrollView>
          ) : (
            <Text>{t("fees.noInfo")}</Text>
          )
        ) : (
          <ActivityIndicator />
        )}

        {/* Moratorium Modal */}
        {fees ? (
          <ModalMoratorium
            fees={fees}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            setMoratoriumStatus={setMoratoriumStatus}
          />
        ) : null}
      </View>
    </View>
  );
};

export default Fees;

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "bold", color: COLORS.textDark },
  subtitle: { fontSize: 16, color: COLORS.textPrimary, marginTop: 2 },
  caption: { fontSize: 13, color: COLORS.textPrimary, marginBottom: 12 },
  section: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { fontSize: 14, fontWeight: "500", color: COLORS.textPrimary },
  value: { fontSize: 14, color: COLORS.textDark },
  tableTitle: { fontSize: 16, fontWeight: "600", marginTop: 20, marginBottom: 8, color: COLORS.textDark },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 6,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  cell: { flex: 1, fontSize: 13, color: COLORS.textPrimary },
  bold: { fontWeight: "bold", color: "white" },
  moratoriumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: { color: "white", marginRight: 6 },
  statusSection: { flexDirection: "row", alignItems: "center", marginTop: 12, gap: 8 },
  statusLabel: { fontSize: 14, color: COLORS.textPrimary },
});

// GraphQL query
const GET_DATA = gql`
  query GetData($userprofileId: Decimal!) {
    allSchoolFees(userprofileId: $userprofileId) {
      edges {
        node {
          id balance
          userprofile {
            customuser { id fullName matricle }
            specialty {
              id academicYear
              mainSpecialty { specialtyName }
              level { level }
              registration tuition paymentOne paymentTwo paymentThree
            }
          }
          platformPaid idPaid
          transactions { id amount reason ref createdAt }
          moratoires {
            id reason status
            requestedSchedule { amount dueDate }
            approvedSchedule { amount dueDate }
          }
        }
      }
    }
  }
`;
