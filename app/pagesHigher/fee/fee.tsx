import AppHeader from "@/components/AppHeader";
import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { NodeSchoolFees } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ModalMoratorium from "../../pagesHigher/fee/ModalMoratorium";



const Fees = () => {
  const { profileId } = useAuthStore();

  const { data: dataFees, loading, error } = useQuery(GET_DATA, {
    variables: {
      userprofileId: profileId,
    },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [fees, setFees] = useState<NodeSchoolFees>();
  const [moratoriumStatus, setMoratoriumStatus] = useState(null);


  useEffect(() => {
    if (dataFees?.allSchoolFees?.edges?.length) {
      const f = dataFees?.allSchoolFees?.edges[0];
      setFees(f?.node);
    }
  }, [dataFees]);

  
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader showBack   showTitle  />

      {!loading ?
        fees?.id ?
          <ScrollView contentContainerStyle={{ padding: 10, }}>
            <Text style={styles.title}>{fees?.userprofile?.customuser?.fullName}</Text>
            <Text style={styles.title}>Matricle: {fees?.userprofile?.customuser?.matricle}</Text>
            <Text style={styles.subtitle}>Specialty: {fees.userprofile?.specialty?.mainSpecialty?.specialtyName}</Text>
            <Text style={styles.caption}>Academic Year: {fees.userprofile?.specialty?.academicYear}</Text>

            <View style={styles.section}>
              <Text style={styles.label}>Level:</Text>
              <Text style={styles.value}>{fees?.userprofile?.specialty?.level?.level}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Tuition:</Text>
              <Text style={styles.value}>{fees?.userprofile?.specialty?.tuition?.toLocaleString()} F</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>First Payment:</Text>
              <Text style={styles.value}>{fees?.userprofile?.specialty?.paymentOne?.toLocaleString()} F</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Second Payment:</Text>
              <Text style={styles.value}>{fees?.userprofile?.specialty?.paymentTwo?.toLocaleString()} F</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Third Payment:</Text>
              <Text style={styles.value}>{fees?.userprofile?.specialty?.paymentThree?.toLocaleString()} F</Text>
            </View>

            <Text style={styles.tableTitle}>All Transactions</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.cell, styles.bold]}>Tx ID</Text>
              <Text style={[styles.cell, styles.bold]}>Reason</Text>
              <Text style={[styles.cell, styles.bold]}>Amount</Text>
            </View>

            {
              fees?.transactions?.map((trans) => (
                <View key={trans.id} style={styles.tableRow}>
                  <Text style={styles.cell}>{trans.ref}</Text>
                  <Text style={styles.cell}>{trans.reason}</Text>
                  <Text style={styles.cell}>{trans.amount}</Text>
                </View>
              ))}

            <View style={styles.section}>
              <Text style={styles.label}>Total Paid:</Text>
              <Text style={styles.value}>{(fees?.userprofile?.specialty?.tuition - fees?.balance).toLocaleString()} F</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Balance:</Text>
              <Text style={styles.value}>{fees?.balance} F</Text>
            </View>

            {/* Moratorium Button */}
            {!fees?.moratoires?.length ? <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.moratoriumButton}
            >
              <Text style={styles.buttonText}>Request Moratorium</Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </TouchableOpacity>
            :
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Text style={{ color: "black" }}>Moratoire:</Text>
              <Text style={[styles.buttonText, { color: "green" }]}>{fees?.moratoires[0]?.status}</Text>
            </View>}

            {/* ID Card & Status */}
            <View style={styles.statusSection}>
              <Text style={styles.statusLabel}>ID Card:</Text>
              {fees?.idPaid ?
                <Ionicons name="checkmark-circle" size={20} color="green" />
                :
                <Ionicons name="checkmark-circle" size={20} color="red" />
              }
            </View>
            <View style={styles.statusSection}>
              <Text style={styles.statusLabel}>Account Status:</Text>
              {fees?.platformPaid ?
                <Ionicons name="checkmark-circle" size={20} color="green" />
                :
                <Ionicons name="checkmark-circle" size={20} color="red" />
              }
            </View>
          </ScrollView>

          :

          <Text>No School Fees Info</Text>

        :

        <ActivityIndicator />
      }

      {/* Moratorium Modal */}
      {fees ? <ModalMoratorium
        fees={fees}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setMoratoriumStatus={setMoratoriumStatus}

      /> : null}

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
});



const GET_DATA = gql`
  query GetData (
    $userprofileId: Decimal!
  ) {
    allSchoolFees (
      userprofileId: $userprofileId
    ) {
      edges {
        node {
          id balance
          userprofile { 
            customuser { id fullName matricle }
            specialty { 
              id academicYear
              mainSpecialty { specialtyName }
              level { level }  
              registration tuition paymentOne paymentTwo paymentThree
            }
          }
          platformPaid idPaid
          transactions { id amount reason ref createdAt }
          moratoires { 
            id reason status
            requestedSchedule { amount dueDate }
            approvedSchedule { amount dueDate }
          }
        }
      }
    }
  }
`;