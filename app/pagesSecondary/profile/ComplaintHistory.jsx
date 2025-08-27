import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../../components/Header";
import COLORS from "../../../constants/colors";

const complaintHistory = [
  {
    id: "1",
    type: "Result Issue",
    date: "2025-07-22",
    status: "Pending",
    attachment: null,
  },
  {
    id: "2",
    type: "Fee Dispute",
    date: "2025-07-15",
    status: "Resolved",
    attachment:
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  },
  {
    id: "3",
    type: "Other",
    date: "2025-06-30",
    status: "In Review",
    attachment: null,
  },
];

export default function ComplaintHistory() {
  const renderComplaint = ({ item }) => (
    <View style={styles.card}>
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
        <TouchableOpacity style={styles.attachment}>
          <Image
            source={{ uri: item.attachment }}
            style={styles.imagePreview}
          />
          <Text style={styles.attachmentText}>View Attachment</Text>
          <Ionicons name="open-outline" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header placeholder="search complain history" />
      <Text style={styles.title}>Complaint History</Text>
      <FlatList
        data={complaintHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderComplaint}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
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
});
