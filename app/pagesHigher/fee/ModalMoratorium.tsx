import COLORS from "@/constants/colors";
import { NodeSchoolFees } from "@/utils/schemas/interfaceGraphql";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  { fees, modalVisible, setModalVisible, setMoratoriumStatus }:
  { fees: NodeSchoolFees, modalVisible: boolean, setModalVisible: any, setMoratoriumStatus: any }
) => {
  const [reason, setReason] = useState("");
  const [schedules, setSchedules] = useState<{ id: number; amount: string; date: Date }[]>([]);
  const [showPickerId, setShowPickerId] = useState<number | null>(null);

  // add a new schedule field
  const addSchedule = () => {
    if (schedules.length < 4) {
      setSchedules([...schedules, { id: Date.now(), amount: "", date: new Date() }]);
    }
  };

  // remove schedule field
  const removeSchedule = (id: number) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  // update schedule
  const updateSchedule = (id: number, field: "amount" | "date", value: any) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // handle submit
  const handleApply = () => {
    if (schedules.length === 0 || reason.trim() === "") {
      alert("Please add at least one schedule and a reason.");
      return;
    }
    setModalVisible(false);
    setMoratoriumStatus("pending"); // update parent state
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

      {/* Date Field with border */}
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowPickerId(item.id)}
      >
        <Text>{item.date.toLocaleDateString()}</Text>
        <Ionicons name="calendar" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Remove schedule */}
      <TouchableOpacity onPress={() => removeSchedule(item.id)}>
        <Ionicons name="close-circle" size={22} color="red" />
      </TouchableOpacity>

      {/* Date Picker (hidden until calendar pressed) */}
      {showPickerId === item.id && (
        <DateTimePicker
          value={item.date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowPickerId(null);
            if (selectedDate) updateSchedule(item.id, "date", selectedDate);
          }}
        />
      )}
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
  dateInput: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  padding: 8,
  backgroundColor: "#fff",
},

});
