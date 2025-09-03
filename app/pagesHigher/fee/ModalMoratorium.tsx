import COLORS from "@/constants/colors";
import { NodeSchoolFees } from "@/utils/schemas/interfaceGraphql";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


const ModalMoratorium = (
    { fees, modalVisible, setModalVisible }:
    { fees: NodeSchoolFees, modalVisible: boolean, setModalVisible: any }
) => {

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
            <Text style={styles.modalInfo}>Class: {fees?.userprofile?.specialty?.mainSpecialty?.specialtyName}</Text>
            <Text style={styles.modalInfo}>Year / Level: {fees?.userprofile?.specialty?.academicYear} - {fees?.userprofile?.specialty?.level?.level}</Text>
            <Text style={styles.modalInfo}>Balance: {fees?.balance.toLocaleString()} F</Text>

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
  );
}

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
