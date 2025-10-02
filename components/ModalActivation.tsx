import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { Picker } from "@react-native-picker/picker";
import { ApiFactory } from "@/utils/graphql/ApiFactory";
import { NodeSchoolFees } from "@/utils/schemas/interfaceGraphql";
import { gql } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { TFunction } from "i18next";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";


const ModalActivation = ({
  refetch,
  fees,
  modalVisible,
  setModalVisible,
}: {
  refetch: any;
  fees: NodeSchoolFees;
  modalVisible: boolean;
  setModalVisible: any;
}) => {
  const { t } = useTranslation();
  const { feesId, schoolIdentification } = useAuthStore();

  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [operator, setOperator] = useState("");

  /** APPLY FUNCTION */
  const handleApply = async () => {

    if ( phoneNumber?.length < 9) {
      alert("Invalid Telephone");
      return;
    }

    if (operator?.length < 3) {
      alert("Invalid Operator");
      return;
    }

    const dataForMutation = {
      schoolfeesIds: [feesId],
      amount: parseInt(schoolIdentification?.platformCharges.toString() || "1000"),
      operator,
      phoneNumber,
      reason: "PLATFORM CHARGES",
      section: "H",
      origin: "student",
      status: "Pending",
    };
    console.log(dataForMutation);

    const successData = await ApiFactory({
      newData: dataForMutation,
      editData: dataForMutation,
      mutationName: "makePaymentTransaction",
      modelName: "payment",
      successField: "id",
      query,
      router: null,
      params: null,
      redirect: false,
      reload: false,
      returnResponseField: true,
      redirectPath: ``,
      actionLabel: "creating",
      token: useAuthStore.getState().token,
    });

    if (successData?.length > 10) {
      alert(t("submittedSuccessfully"));
      refetch();
      setModalVisible(false);
    }
  };

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeIcon}>
            <Ionicons name="close" size={24} color={COLORS.textDark} />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{t("feesActivation")}</Text>

          {/* Student Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              {t("class")}: {fees?.userprofile?.specialty?.mainSpecialty?.specialtyName}
            </Text>
            <Text style={styles.infoText}>
              {t("yearLevel")}: {fees?.userprofile?.specialty?.academicYear} -{" "}
              {fees?.userprofile?.specialty?.level?.level}
            </Text>
            <Text style={styles.infoText}>
              {t("balance")}: {fees?.balance.toLocaleString()} F
            </Text>
          </View>

          {/* Amount Input */}
          <TextInput
            placeholder={t("amount")}
            style={styles.input}
            value={schoolIdentification?.platformCharges.toString() || "1000"}
            onChangeText={setAmount}
          />

          {/* Telephone Input */}
          <TextInput
            placeholder={t("telephone")}
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          {/* Operator Input */}
          <View style={styles.inputGroup}>
            <Picker
              selectedValue={operator}
              onValueChange={(itemValue) => setOperator(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="------------" value="" />
              <Picker.Item label="MTN" value="MTN" />
              <Picker.Item label="ORANGE" value="ORANGE" />
            </Picker>
          </View>

          {/* Apply Button */}
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>{t("apply")}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalActivation;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: COLORS.textDark,
  },
  infoCard: {
    backgroundColor: "#f2f5f7",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.textDark,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
  },
  dateInputTouchable: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    justifyContent: "center",
    padding: 10,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    justifyContent: "center",
  },
  addText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    textAlignVertical: "top",
    marginBottom: 16,
    fontWeight: 700,
    fontSize: 18,
  },
  // --- Payment styles ---
  inputGroup: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: { height: 48, width: "100%", paddingHorizontal: 16 },
  applyButton: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

const query = gql`
  mutation makePaymentTransaction(
    $schoolfeesIds: [Int!]!
    $amount: Int!
    $phoneNumber: String!
    $operator: String!
    $section: String!
    $reason: String!
    $origin: String!
  ) {
    makePaymentTransaction(
      schoolfeesIds: $schoolfeesIds
      amount: $amount
      phoneNumber: $phoneNumber
      operator: $operator
      section: $section
      reason: $reason
      origin: $origin
    ) {
      payment {
        id
      }
    }
  }
`;
function validateMoratoriumApplication(
  schedules: { id: number; amount: string; due_date: string; error?: string; }[],
  reason: string,
  balance: number,
  t: TFunction<"translation", undefined>
): { isValid: boolean; message: string } {
  if (!reason.trim()) {
    return { isValid: false, message: t("reasonRequired") };
  }
  if (schedules.length === 0) {
    return { isValid: false, message: t("atLeastOneSchedule") };
  }
  let totalAmount = 0;
  for (const schedule of schedules) {
    if (!schedule.amount || isNaN(Number(schedule.amount)) || Number(schedule.amount) <= 0) {
      return { isValid: false, message: t("invalidAmount") };
    }
    if (!schedule.due_date) {
      return { isValid: false, message: t("dateRequired") };
    }
    if (schedule.error) {
      return { isValid: false, message: schedule.error };
    }
    totalAmount += Number(schedule.amount);
  }
  if (totalAmount < balance) {
    return { isValid: false, message: t("totalAmountLessThanBalance") };
  }
  return { isValid: true, message: "" };
}

