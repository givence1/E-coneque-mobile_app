import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { capitalizeFirstLetter, validateDate } from "@/utils/functions";
import { ApiFactory } from "@/utils/graphql/ApiFactory";
import { NodeSchoolFees } from "@/utils/schemas/interfaceGraphql";
import { gql } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";




const ModalMoratorium = (
  { fees, modalVisible, setModalVisible }:
    { fees: NodeSchoolFees, modalVisible: boolean, setModalVisible: any, setMoratoriumStatus: any }
) => {
  const [reason, setReason] = useState("");
  const { profileId } = useAuthStore();
  const [schedules, setSchedules] = useState<{ id: number; amount: string; due_date: string; error?: string }[]>([]);

  const addSchedule = () => {
    if (schedules.length < 4) {
      setSchedules([...schedules, { id: Date.now(), amount: "", due_date: "", error: "" }]);
    }
  };

  const removeSchedule = (id: number) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const updateSchedule = (id: number, field: "amount" | "due_date" | "error", value: any) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleDateChange = (id: number, val: string) => {
    const formattedDate = formatDateInput(val);
    const validation = validateDate(formattedDate);

    setSchedules(schedules.map(s => {
      if (s.id === id) {
        return {
          ...s,
          due_date: formattedDate,
          error: formattedDate.length === 10 && !validation?.isValid
            ? validation?.error || "Invalid date"
            : ""
        };
      }
      return s;
    }));
  };

  const formatDateInput = (text: string) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 8) {
      cleaned = cleaned.substring(0, 8);
    }
    if (cleaned.length < 4) {
      return cleaned;
    } else if (cleaned.length == 4) {
      return `${cleaned.substring(0, 4)}-`;
    } else if (cleaned.length < 6) {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(4)}`;
    } else {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(4, 6)}-${cleaned.substring(6, 8)}`;
    }
  };


  const handleApply = async () => {
    const validation = validateMoratoriumApplication(schedules, reason, fees?.balance);

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    const sortedSchedules = [...schedules]
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .map(({ due_date, amount }) => ({
        due_date,
        amount: parseFloat(amount)
      }));

    const requestedSchedule = JSON.stringify(sortedSchedules.map((s: any) => {
      return { amount: s.amount, due_date: s.due_date }
    })
    );
 


    const dataForMutation = {
      userprofileId: profileId,
      reason: capitalizeFirstLetter(reason),
      status: "Pending",
      requestedSchedule,
      comment: "",
      delete: false,
    }

       console.log(dataForMutation);
    // return

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
    });

    console.log(successData);
    if (successData) {
      alert("Submitted Successfully");
      setModalVisible(false)
    }

  };


  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeIcon}
          >
            <Ionicons name="close" size={20} color="black" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Moratoire Application</Text>
          <Text style={styles.modalInfo}>
            Class: {fees?.userprofile?.specialty?.mainSpecialty?.specialtyName}
          </Text>
          <Text style={styles.modalInfo}>
            Year / Level: {fees?.userprofile?.specialty?.academicYear} - {fees?.userprofile?.specialty?.level?.level}
          </Text>
          <Text style={styles.modalInfo}>
            Balance: {fees?.balance.toLocaleString()} F
          </Text>

          <Text style={styles.modalSubtitle}>Requested Schedule</Text>

          <FlatList
            data={schedules}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.scheduleRow}>

                <TextInput
                  style={styles.amountInput}
                  placeholder="Amount"
                  keyboardType="numeric"
                  value={item.amount}
                  onChangeText={(val) => updateSchedule(item.id, "amount", val)}
                />

                <View style={styles.dateInputContainer}>
                  <TextInput
                    style={[
                      styles.dateInput,
                      item.error && styles.dateInputError
                    ]}
                    placeholder="YYYY-MM-DD"
                    value={item.due_date}
                    onChangeText={(val) => handleDateChange(item.id, val)}
                    keyboardType="numbers-and-punctuation"
                    maxLength={10}
                  />
                  {item.error ? (
                    <Text style={styles.errorText}>{item.error}</Text>
                  ) : null}
                </View>



                <TouchableOpacity onPress={() => removeSchedule(item.id)}>
                  <Ionicons name="close-circle" size={22} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />

          {schedules.length < 4 && (
            <TouchableOpacity style={styles.addButton} onPress={addSchedule}>
              <Ionicons name="add-circle" size={36} color={COLORS.primary} />
            </TouchableOpacity>
          )}

          <TextInput
            placeholder="Enter your reason (motif)..."
            style={styles.input}
            multiline
            value={reason}
            onChangeText={setReason}
          />

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalMoratorium;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.textDark,
    textAlign: "center",
  },
  modalInfo: {
    fontSize: 13,
    marginBottom: 4,
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
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
    padding: 8,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  dateInputError: {
    borderColor: "#fff",
  },
  addButton: {
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontWeight: "600",
  },
  errorText: {
    color: "#c73131ff",
    fontSize: 12,
    marginTop: 2,
  },
});


const validateMoratoriumApplication = (schedules: { id: number; amount: string; due_date: string; error?: string }[], reason: string, balance: number): { isValid: boolean; message?: string } => {
  // Check if at least one schedule exists
  if (schedules.length === 0) {
    return { isValid: false, message: "Please add at least one schedule." };
  }

  // Check if reason is provided and has minimum length
  if (reason.trim() === "") {
    return { isValid: false, message: "Please provide a reason for the moratorium." };
  }

  if (reason.trim().length < 10) {
    return { isValid: false, message: "Reason must be at least 10 characters long." };
  }

  // Check if all amounts are valid numbers and positive
  const invalidAmounts = schedules.some(schedule => {
    const amount = parseFloat(schedule.amount);
    return isNaN(amount) || amount <= 0;
  });

  if (invalidAmounts) {
    return { isValid: false, message: "All amounts must be valid positive numbers." };
  }

  // Calculate total amount from all schedules
  const totalAmount = schedules.reduce((sum: number, schedule: any) => {
    return sum + parseFloat(schedule.amount);
  }, 0);

  // Check if total amount matches the balance
  if (totalAmount !== balance) {
    return {
      isValid: false,
      message: `Total amount (${totalAmount.toLocaleString()} F) must equal the balance (${balance.toLocaleString()} F).`
    };
  }

  // Check if any schedule has validation errors
  const hasErrors = schedules.some(schedule => schedule.error);
  if (hasErrors) {
    return { isValid: false, message: "Please fix all date validation errors before applying." };
  }

  // Additional validation: Re-validate all dates to ensure they're completely valid
  const invalidDates = schedules.some(schedule => {
    const validation = validateDate(schedule.due_date);
    return !validation.isValid;
  });

  if (invalidDates) {
    return { isValid: false, message: "Please ensure all dates are valid (YYYY-MM-DD format and exist in calendar)." };
  }

  // If all validations pass
  return { isValid: true };
};



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