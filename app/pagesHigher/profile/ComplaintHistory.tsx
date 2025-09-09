import AppHeader from "@/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageStyle,
  KeyboardAvoidingView,
  ListRenderItem,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import COLORS from "../../../constants/colors";

// ---------- Types ----------
type ComplaintItem = {
  id: string;
  type: string;
  date: string;
  status: "Pending" | "Resolved" | "In Review";
  attachment: string | null;
  message?: string;
};

const complaintHistory: ComplaintItem[] = [
  {
    id: "1",
    type: "Result Problem",
    date: "2025-07-22",
    status: "Pending",
    attachment: null,
    message: "I believe my exam result was not recorded correctly.",
  },
  {
    id: "2",
    type: "Fee Issue",
    date: "2025-07-15",
    status: "Resolved",
    attachment: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    message: "I was charged an incorrect fee.",
  },
  {
    id: "3",
    type: "Other",
    date: "2025-06-30",
    status: "In Review",
    attachment: null,
    message: "General complaint.",
  },
];

const ComplaintHistory: React.FC = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: "Fee Issue", value: "Fee Issue" },
    { label: "Result Problem", value: "Result Problem" },
    { label: "Lecturer Misconduct", value: "Lecturer Misconduct" },
    { label: "Attendance", value: "Attendance" },
    { label: "Other", value: "Other" },
  ]);
  const [message, setMessage] = useState("");

  const handleEdit = (complaint: ComplaintItem) => {
    setSelectedComplaint(complaint);
    setType(complaint.type);
    setMessage(complaint.message || "");
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!type || !message.trim()) {
      Alert.alert("Error", "Please select a type and enter your message.");
      return;
    }

    Alert.alert("Updated", "Your complaint has been updated.");
    setModalVisible(false);
    setSelectedComplaint(null);
  };

  const renderComplaint: ListRenderItem<ComplaintItem> = ({ item }) => {
    const isEditable = item.status === "Pending";

    return (
      <TouchableOpacity
        activeOpacity={isEditable ? 0.7 : 1}
        onPress={() => isEditable && handleEdit(item)}
        style={[styles.card, !isEditable && { opacity: 0.7 }]}
        disabled={!isEditable}
      >
        <View style={styles.row}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{item.type}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.status,
              item.status === "Pending"
                ? styles.pending
                : item.status === "Resolved"
                ? styles.resolved
                : styles.inReview,
            ]}
          >
            {item.status}
          </Text>
        </View>

        {item.attachment && (
          <TouchableOpacity
            style={styles.attachment}
            onPress={() => console.log("Open attachment", item.attachment)}
          >
            <Image source={{ uri: item.attachment }} style={styles.imagePreview} />
            <Text style={styles.attachmentText}>View Attachment</Text>
            <Ionicons name="open-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
     <AppHeader showBack  showTitle  />
      <Text style={styles.title}>Complaint History</Text>
      <FlatList
        data={complaintHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderComplaint}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContent}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Text style={styles.modalTitle}>Edit Complaint</Text>

            <Text style={styles.label}>Complaint Type</Text>
            <DropDownPicker
              open={open}
              value={type}
              items={items}
              setOpen={setOpen}
              setValue={setType}
              setItems={setItems}
              placeholder="Select type"
              style={styles.dropdown}
              dropDownContainerStyle={{ borderColor: "#ccc" }}
            />

            <Text style={styles.label}>Message</Text>
            <TextInput
              placeholder="Describe your issue..."
              value={message}
              onChangeText={setMessage}
              style={[styles.input, { height: 120 }]}
              multiline
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ccc", marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.buttonText, { color: "#333" }]}>Cancel</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

export default ComplaintHistory;

// ---------- Styles ----------
type Styles = {
  container: ViewStyle;
  title: TextStyle;
  card: ViewStyle;
  row: ViewStyle;
  label: TextStyle;
  value: TextStyle;
  status: TextStyle;
  pending: TextStyle;
  resolved: TextStyle;
  inReview: TextStyle;
  attachment: ViewStyle;
  imagePreview: ImageStyle;
  attachmentText: TextStyle;
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalTitle: TextStyle;
  dropdown: ViewStyle;
  input: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  value: {
    color: COLORS.textPrimary,
  },
  status: {
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pending: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  resolved: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  inReview: {
    backgroundColor: "#cce5ff",
    color: "#004085",
  },
  attachment: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  imagePreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  attachmentText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.primary,
  },
  dropdown: {
    borderColor: "#ccc",
    marginBottom: 10,
    zIndex: 1000,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
