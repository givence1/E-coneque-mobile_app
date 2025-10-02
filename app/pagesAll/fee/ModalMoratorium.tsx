import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { capitalizeFirstLetter, validateDate } from "@/utils/functions";
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

const ModalMoratorium = ({
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
  const { profileId } = useAuthStore();

  const [reason, setReason] = useState("");
  const [schedules, setSchedules] = useState<
    { id: number; amount: string; due_date: string; error?: string }[]
  >([]);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

  // 🔹 Helper to format date as DD/MM/YYYY
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const addSchedule = () => {
    if (schedules.length < 4) {
      setSchedules([
        ...schedules,
        { id: Date.now(), amount: "", due_date: "", error: "" },
      ]);
    }
  };

  const removeSchedule = (id: number) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const updateSchedule = (
  id: number,
  field: "amount" | "due_date" | "error",
  value: any
) => {
  // Create a new array to trigger re-render
  setSchedules((prevSchedules) =>
    prevSchedules.map((s) =>
      s.id === id
        ? {
            ...s,
            [field]: value,
          }
        : s
    )
  );
};


 const handleConfirmDate = (date: Date) => {
  if (selectedScheduleId !== null) {
    const formattedDate = formatDate(date); // e.g., DD/MM/YYYY
    const validation = validateDate(date.toISOString().split("T")[0]);

    // Update both due_date and error at once
    setSchedules((prevSchedules) =>
      prevSchedules.map((s) =>
        s.id === selectedScheduleId
          ? {
              ...s,
              due_date: formattedDate,
              error: validation.isValid ? "" : t("Invalid Date"),
            }
          : s
      )
    );

    setDatePickerVisible(false);
    setSelectedScheduleId(null);
  }
};

  const openDatePicker = (scheduleId: number) => {
    setSelectedScheduleId(scheduleId);
    setDatePickerVisible(true);
  };

  /** APPLY FUNCTION */
  const handleApply = async () => {
    const validation = validateMoratoriumApplication(schedules, reason, fees?.balance, t);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    const sortedSchedules = [...schedules]
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.due_date.split("/").map(Number);
        const [dayB, monthB, yearB] = b.due_date.split("/").map(Number);
        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
      })
      .map(({ due_date, amount }) => {
        // Convert back to YYYY-MM-DD for backend
        const [day, month, year] = due_date.split("/").map(Number);
        const formattedForApi = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return { due_date: formattedForApi, amount: parseFloat(amount) };
      });

    const requestedSchedule = JSON.stringify(
      sortedSchedules.map((s: any) => ({ amount: s.amount, due_date: s.due_date }))
    );

    const dataForMutation = {
      userprofileId: profileId,
      reason: capitalizeFirstLetter(reason),
      status: "PENDING",
      requestedSchedule,
      comment: "",
      delete: false,
    };

    const successData = await ApiFactory({
      newData: dataForMutation,
      editData: dataForMutation,
      mutationName: "createUpdateDeleteMoratoire",
      modelName: "moratoire",
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
      alert(t("Submitted Successfully"));
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

          <Text style={styles.modalTitle}>{t("Moratorium Application")}</Text>

          {/* Student Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              {t("Class")}: {fees?.userprofile?.specialty?.mainSpecialty?.specialtyName}
            </Text>
            <Text style={styles.infoText}>
              {t("Accademic Year")}: {fees?.userprofile?.specialty?.academicYear} -{" "}
              {fees?.userprofile?.specialty?.level?.level}
            </Text>
            <Text style={styles.infoText}>
              {t("Balance")}: {fees?.balance.toLocaleString()} F
            </Text>
          </View>

          <Text style={styles.modalSubtitle}>{t("Requested Schedule")}</Text>

          {/* SCHEDULE LIST */}
          <FlatList
            data={schedules}
            keyExtractor={(item) => item.id.toString()}
            style={{ maxHeight: 250 }}
            renderItem={({ item }) => (
              <View style={styles.scheduleRow}>
                <TextInput
                  style={styles.amountInput}
                  placeholder={t("Amount")}
                  keyboardType="numeric"
                  value={item.amount}
                  onChangeText={(val) => updateSchedule(item.id, "amount", val)}
                />
                <TouchableOpacity
                  style={styles.dateInputTouchable}
                  onPress={() => openDatePicker(item.id)}
                >
                  <Text style={[styles.dateText, item.error && { color: "red" }]}>
                    {item.due_date || t("Select Date")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeSchedule(item.id)}>
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />

          {schedules.length < 4 && (
            <TouchableOpacity style={styles.addButton} onPress={addSchedule}>
              <Ionicons name="add-circle" size={40} color={COLORS.primary} />
              <Text style={styles.addText}>{t("Add Schedule")}</Text>
            </TouchableOpacity>
          )}

          {/* Reason Input */}
          <TextInput
            placeholder={t("Enter Reason Here...")}
            style={styles.input}
            multiline
            value={reason}
            onChangeText={setReason}
          />

          {/* Apply Button */}
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>{t("apply")}</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={() => setDatePickerVisible(false)}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalMoratorium;

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
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 16,
  },
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
  mutation CreateUpdateDeleteMoratoire(
    $comment: String
    $reason: String!
    $requestedSchedule: JSONString!
    $status: String!
    $userprofileId: ID!
    $delete: Boolean!
  ) {
    createUpdateDeleteMoratoire(
      comment: $comment
      reason: $reason
      requestedSchedule: $requestedSchedule
      status: $status
      userprofileId: $userprofileId
      delete: $delete
    ) {
      moratoire {
        id
        status
        reason
        createdAt
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
    return { isValid: false, message: t("Reason Required") };
  }
  if (schedules.length === 0) {
    return { isValid: false, message: t("AtLeast One Schedule") };
  }
  let totalAmount = 0;
  for (const schedule of schedules) {
    if (!schedule.amount || isNaN(Number(schedule.amount)) || Number(schedule.amount) <= 0) {
      return { isValid: false, message: t("Invalid Amount") };
    }
    if (!schedule.due_date) {
      return { isValid: false, message: t("Date Required") };
    }
    if (schedule.error) {
      return { isValid: false, message: schedule.error };
    }
    totalAmount += Number(schedule.amount);
  }
  if (totalAmount < balance) {
    return { isValid: false, message: t("total AmountLess ThanBalance") };
  }
  return { isValid: true, message: "" };
}
