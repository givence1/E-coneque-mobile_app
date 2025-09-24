// Fees.tsx
import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { NodeSchoolFees } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ModalMoratorium from "./ModalMoratorium";

const Fees = () => {
  const { t } = useTranslation();
  const { profileId } = useAuthStore();

  const { data: dataFees, loading } = useQuery(GET_DATA, {
    variables: { userprofileId: profileId },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [fees, setFees] = useState<NodeSchoolFees>();
  const [moratoriumStatus, setMoratoriumStatus] = useState(null);

  // --- Payment form states ---
  const [paymentMethod, setPaymentMethod] = useState("MTN");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [showPaymentCard, setShowPaymentCard] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  useEffect(() => {
    if (dataFees?.allSchoolFees?.edges?.length) {
      const f = dataFees?.allSchoolFees?.edges[0];
      setFees(f?.node);
    }
  }, [dataFees]);

  const totalPaid =
    (fees?.userprofile?.specialty?.tuition ?? 0) - (fees?.balance ?? 0);
  const progress = fees?.userprofile?.specialty?.tuition
    ? (totalPaid / fees.userprofile.specialty.tuition) * 100
    : 0;

  const handleSubmitPayment = () => {
  console.log("Submitting payment:", {
    method: paymentMethod,
    amount,
    phone,
  });
  alert(`Payment submitted: ${amount} F via ${paymentMethod}`);
  setPaymentModalVisible(false); 
};

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack showTitle />

      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : fees?.id ? (
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 60,
              paddingTop: 80,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Student Info Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name="person-circle"
                  size={28}
                  color={COLORS.primary}
                />
                <Text style={styles.cardTitle}>
                  {fees?.userprofile?.customuser?.fullName}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.level")}:</Text>
                <Text style={styles.value}>
                  {fees?.userprofile?.specialty?.level?.level}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.matricule")}:</Text>
                <Text style={styles.value}>
                  {fees?.userprofile?.customuser?.matricle}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.specialty")}:</Text>
                <Text style={styles.value}>
                  {fees.userprofile?.specialty?.mainSpecialty?.specialtyName}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.academicYear")}:</Text>
                <Text style={styles.value}>
                  {fees.userprofile?.specialty?.academicYear}
                </Text>
              </View>
            </View>

            {/* Tuition & Payments Card */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t("fees.tuition")}</Text>

              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.tuition")}:</Text>
                <Text style={styles.value}>
                  {fees?.userprofile?.specialty?.tuition?.toLocaleString()} F
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.payment1")}:</Text>
                <Text style={styles.value}>
                  {fees?.userprofile?.specialty?.paymentOne?.toLocaleString()} F
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.payment2")}:</Text>
                <Text style={styles.value}>
                  {fees?.userprofile?.specialty?.paymentTwo?.toLocaleString()} F
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.payment3")}:</Text>
                <Text style={styles.value}>
                  {fees?.userprofile?.specialty?.paymentThree?.toLocaleString()}{" "}
                  F
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
                {fees?.userprofile?.specialty?.tuition?.toLocaleString()} F
              </Text>
            </View>

            {/* Transactions Card */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t("fees.transactions")}</Text>

              {/* Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.bold, { flex: 2 }]}>
                  {t("fees.txId")}
                </Text>
                <Text style={[styles.cell, styles.bold, { flex: 2 }]}>
                  {t("fees.reason")}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    styles.bold,
                    { flex: 1, textAlign: "right" },
                  ]}
                >
                  {t("fees.amount")}
                </Text>
              </View>

              {/* Rows */}
              {fees?.transactions?.map((trans) => (
                <View key={trans.id} style={styles.tableRow}>
                  <Text style={[styles.cell, { flex: 2 }]}>{trans.ref}</Text>
                  <Text style={[styles.cell, { flex: 2 }]}>{trans.reason}</Text>
                  <Text
                    style={[styles.cell, { flex: 1, textAlign: "right" }]}
                  >
                    {trans.amount.toLocaleString()} F
                  </Text>
                </View>
              ))}
            </View>

            {/* Totals & Balance */}
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.totalPaid")}:</Text>
                <Text style={styles.value}>{totalPaid.toLocaleString()} F</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("fees.balance")}:</Text>
                <Text style={styles.value}>
                  {fees?.balance.toLocaleString()} F
                </Text>
              </View>
            </View>

            {/* Moratorium */}
            <View style={styles.card}>
              {!fees?.moratoires?.length ? (
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={styles.moratoriumButton}
                >
                  <Text style={styles.buttonText}>
                    {t("fees.requestMoratorium")}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="white" />
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "black" }}>{t("fees.moratorium")}:</Text>
                  <Text style={[styles.badge, { backgroundColor: "green" }]}>
                    {fees?.moratoires[0]?.status}
                  </Text>
                </View>
              )}
            </View>
{/* Payment (Button + Card) */}
<View style={styles.card}>
  {!showPaymentCard ? (
    // Show button if card is hidden
    <TouchableOpacity
      onPress={() => setShowPaymentCard(true)}
      style={styles.moratoriumButton}
    >
      <Text style={styles.buttonText}>{t("fees.makePayment")}</Text>
      <Ionicons name="arrow-forward" size={16} color="white" />
    </TouchableOpacity>
  ) : (
    <View>
      {/* Header with title + X */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.sectionTitle}>{t("fees.singlePayment")}</Text>

        <TouchableOpacity onPress={() => setShowPaymentCard(false)}>
          <Ionicons name="close" size={22} color="black" />
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      <View style={styles.inputGroup}>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="MTN" value="MTN" />
          <Picker.Item label="ORANGE" value="ORANGE" />
        </Picker>
      </View>

      {/* Amount */}
      <TextInput
        style={styles.input}
        placeholder={t("fees.enterAmount")}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Phone */}
      <TextInput
        style={styles.input}
        placeholder={t("fees.enterPhone")}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* Submit */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitPayment}
      >
        <Text style={styles.submitText}>{t("fees.submit")}</Text>
      </TouchableOpacity>
    </View>
  )}
</View>


            {/* Status Indicators */}
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>{t("fees.idCard")}:</Text>
                {fees?.idPaid ? (
                  <Ionicons name="checkmark-circle" size={22} color="green" />
                ) : (
                  <Ionicons name="close-circle" size={22} color="red" />
                )}
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>
                  {t("fees.accountStatus")}:
                </Text>
                {fees?.platformPaid ? (
                  <Ionicons name="checkmark-circle" size={22} color="green" />
                ) : (
                  <Ionicons name="close-circle" size={22} color="red" />
                )}
              </View>
            </View>
          </ScrollView>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            {t("fees.noInfo")}
          </Text>
        )}

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

// --- STYLES ---
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
    color: COLORS.textDark,
  },
  subTitle: { fontSize: 16, color: COLORS.textPrimary, marginBottom: 2 },
  caption: { fontSize: 14, color: COLORS.textPrimary, marginBottom: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: COLORS.textDark,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontSize: 14, fontWeight: "500", color: COLORS.textPrimary },
  value: { fontSize: 14, color: COLORS.textDark },
  progressContainer: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginVertical: 6,
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
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: { color: "white", marginRight: 6, fontWeight: "600" },
  badge: {
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: "600",
  },
  statusCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    padding: 12,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusLabel: { fontSize: 14, color: COLORS.textPrimary, fontWeight: "500" },

  // --- Payment styles ---
  inputGroup: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: { height: 48, width: "100%" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: COLORS.textDark,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "white", fontWeight: "600", fontSize: 16 },
});

// --- GraphQL Query ---
const GET_DATA = gql`
  query GetData($userprofileId: Decimal!) {
    allSchoolFees(userprofileId: $userprofileId) {
      edges {
        node {
          id
          balance
          userprofile {
            customuser {
              id
              fullName
              matricle
            }
            specialty {
              id
              academicYear
              mainSpecialty {
                specialtyName
              }
              level {
                level
              }
              registration
              tuition
              paymentOne
              paymentTwo
              paymentThree
            }
          }
          platformPaid
          idPaid
          transactions {
            id
            amount
            reason
            ref
            createdAt
          }
          moratoires {
            id
            reason
            status
            requestedSchedule {
              amount
              dueDate
            }
            approvedSchedule {
              amount
              dueDate
            }
          }
        }
      }
    }
  }
`;
