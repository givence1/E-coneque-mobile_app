import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../../components/Header";
import COLORS from "../../../constants/colors";


const transactions = [
  { no: 1, reason: "TUITION", amount: "100,000 F" },
  { no: 2, reason: "TUITION", amount: "200,000 F" },
  { no: 3, reason: "PLATFORM CHARGES", amount: "2 F" },
  { no: 4, reason: "IDCARD", amount: "4 F" },
];

const Fees = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <Header />

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 80 }}>
        <Text style={styles.title}>TAMBE - BU23-NUS-0023</Text>
        <Text style={styles.subtitle}>NURSING</Text>
        <Text style={styles.caption}>Academic Year: 2024/2025</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Level:</Text>
          <Text style={styles.value}>200</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tuition:</Text>
          <Text style={styles.value}>400,000 F</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>First Payment:</Text>
          <Text style={styles.value}>200,000 F</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Second Payment:</Text>
          <Text style={styles.value}>150,000 F</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Third Payment:</Text>
          <Text style={styles.value}>50,000 F</Text>
        </View>

        <Text style={styles.tableTitle}>All Transactions</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.bold]}>No</Text>
          <Text style={[styles.cell, styles.bold]}>Reason</Text>
          <Text style={[styles.cell, styles.bold]}>Amount</Text>
        </View>

        {transactions.map((item) => (
          <View key={item.no} style={styles.tableRow}>
            <Text style={styles.cell}>{item.no}</Text>
            <Text style={styles.cell}>{item.reason}</Text>
            <Text style={styles.cell}>{item.amount}</Text>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.label}>Total Paid:</Text>
          <Text style={styles.value}>300,000 F</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Balance:</Text>
          <Text style={styles.value}>100,000 F</Text>
        </View>

        {/* Moratorium Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.moratoriumButton}
        >
          <Text style={styles.buttonText}>Request Moratorium</Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>

        {/* ID Card & Status */}
        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>ID Card:</Text>
          <Ionicons name="checkmark-circle" size={20} color="green" />
        </View>
        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>Account Status:</Text>
          <Ionicons name="checkmark-circle" size={20} color="green" />
        </View>
      </ScrollView>

      {/* Moratorium Modal */}
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
            <Text style={styles.modalInfo}>Class: Nursing</Text>
            <Text style={styles.modalInfo}>Year / Level: 2024/2025 - 200</Text>
            <Text style={styles.modalInfo}>Balance: 100,000 F</Text>

            <Text style={styles.modalSubtitle}>Request Schedule</Text>
            <TextInput
              placeholder="Enter your reason (motif)..."
              style={styles.input}
              multiline
            />

            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Fees;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  caption: {
    fontSize: 13,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  value: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: COLORS.textDark,
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
  cell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  bold: {
    fontWeight: "bold",
    color: "white",
  },
  moratoriumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 6,
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    marginRight: 6,
  },
  statusSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
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
});
