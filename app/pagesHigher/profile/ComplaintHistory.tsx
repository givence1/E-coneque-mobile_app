import AppHeader from "@/components/AppHeader";
import { useAuthStore } from "@/store/authStore";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import COLORS from "../../../constants/colors";

// ---------- GraphQL ----------
const GET_COMPLAINTS = gql`
  query GetComplaints($role: String!, $userprofileId: Decimal!) {
    allComplains(
      role: $role
      last: 20
      userprofileId: $userprofileId
      status: false
      deleted: false
    ) {
      edges {
        node {
          id
          message
          response
          status
          complainType
          updatedAt
        }
      }
    }
  }
`;

const UPDATE_COMPLAINT = gql`
  mutation UpdateComplaint($id: ID!, $message: String!, $complainType: String!) {
    updateComplain(id: $id, message: $message, complainType: $complainType) {
      complain {
        id
        message
        complainType
        updatedAt
      }
    }
  }
`;

// ---------- Types ----------
type ComplaintNode = {
  id: string;
  message: string;
  response?: string | null;
  status: string;
  complainType: string;
  updatedAt: string;
};

type ComplaintItem = {
  node: ComplaintNode;
};

const ComplaintHistory: React.FC = () => {
  const { profileId, role } = useAuthStore();

  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintNode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [updateComplaint] = useMutation(UPDATE_COMPLAINT);

  // Query complaints
  const { data, loading, error, refetch } = useQuery(GET_COMPLAINTS, {
    variables: {
      role: role || "student",
      userprofileId: profileId || 0,
    },
    skip: !profileId,
    fetchPolicy: "network-only",
    onError: (err) => {
      console.log("❌ Complaints query error:", err.message);
    },
  });

  const handleEdit = (complaint: ComplaintNode) => {
    setSelectedComplaint(complaint);
    setType(complaint.complainType);
    setMessage(complaint.message || "");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!type || !message.trim() || !selectedComplaint) {
      Alert.alert("Error", "Please select a type and enter your message.");
      return;
    }

    try {
      const res = await updateComplaint({
        variables: {
          id: selectedComplaint.id,
          message,
          complainType: type,
        },
      });
      console.log("✅ Complaint updated:", res.data);
      Alert.alert("Updated", "Your complaint has been updated.");
      setModalVisible(false);
      setSelectedComplaint(null);
      refetch();
    } catch (err: any) {
      console.log("❌ Update mutation error:", err.message);
      Alert.alert("Error", "Failed to update complaint.");
    }
  };

  // Data mapping
  const complaints: ComplaintNode[] = data?.allComplains?.edges?.map((e: ComplaintItem) => e.node) || [];

  if (loading) return <Text style={{ marginTop: 100, textAlign: "center" }}>Loading complaints...</Text>;
  if (error) {
    console.log("❌ Apollo error object:", error);
    return <Text style={{ marginTop: 100, textAlign: "center" }}>Error loading complaints.</Text>;
  }

  if (complaints.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader showBack showTitle />
        <View style={styles.content}>
          <Text style={styles.title}>Complaint History</Text>
          <Text style={{ textAlign: "center", marginTop: 20 }}>No complaints yet.</Text>
        </View>
      </View>
    );
  }

  console.log("✅ Complaints data:", complaints);

  const renderComplaint: ListRenderItem<ComplaintNode> = ({ item }) => {
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
          <Text style={styles.value}>{item.complainType}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader showBack showTitle />
      <View style={styles.content}>
        <Text style={styles.title}>Complaint History</Text>
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          renderItem={renderComplaint}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

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
              items={[
                { label: "Fee Issue", value: "fee" },
                { label: "Result Problem", value: "result" },
                { label: "Lecturer Misconduct", value: "lecturer" },
                { label: "Attendance", value: "attendance" },
                { label: "Other", value: "other" },
              ]}
              setOpen={setOpen}
              setValue={setType}
              setItems={() => {}}
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 16,
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