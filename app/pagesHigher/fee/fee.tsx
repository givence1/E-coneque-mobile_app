// import AppHeader from "@/components/AppHeader";
// import COLORS from "@/constants/colors";
// import { useAuthStore } from "@/store/authStore";
// import { NodeSchoolFees } from "@/utils/schemas/interfaceGraphql";
// import { gql, useQuery } from "@apollo/client";
// import { Ionicons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   ActivityIndicator,
//   ScrollView,
//   Text,
//   View
// } from "react-native";
// import ModalMoratorium from "./ModalMoratorium";

// const Fees = () => {
//   console.log("🔄 Fees component mounted");

//   const { t } = useTranslation();
//   const { profileId } = useAuthStore();
//   console.log("👤 profileId:", profileId);

//   const { data: dataFees, loading, error } = useQuery(GET_DATA, {
//     variables: { userprofileId: profileId },
//     skip: !profileId,
//   });

//   const [modalVisible, setModalVisible] = useState(false);
//   const [fees, setFees] = useState<NodeSchoolFees>();
//   const [moratoriumStatus, setMoratoriumStatus] = useState(null);

//   // --- Payment form states ---
//   const [paymentMethod, setPaymentMethod] = useState("MTN");
//   const [amount, setAmount] = useState("");
//   const [phone, setPhone] = useState("");
//   const [showPaymentCard, setShowPaymentCard] = useState(false);
//   const [paymentModalVisible, setPaymentModalVisible] = useState(false);

//   useEffect(() => {
//     console.log("📡 Apollo query state =>", {
//       loading,
//       error,
//       dataFees,
//     });

//     if (error) {
//       console.log("❌ Apollo error:", error.message);
//     }

//     if (dataFees?.allSchoolFees?.edges?.length) {
//       const f = dataFees.allSchoolFees.edges[0];
//       console.log("✅ Fees data found:", f?.node);
//       setFees(f?.node);
//     } else {
//       console.log("⚠️ No fees edges found in dataFees");
//     }
//   }, [dataFees, loading, error]);

//   const totalPaid =
//     (fees?.userprofile?.specialty?.tuition ?? 0) - (fees?.balance ?? 0);
//   const progress = fees?.userprofile?.specialty?.tuition
//     ? (totalPaid / fees.userprofile.specialty.tuition) * 100
//     : 0;

//   console.log("💰 Computed totals:", {
//     totalPaid,
//     tuition: fees?.userprofile?.specialty?.tuition,
//     balance: fees?.balance,
//     progress: progress.toFixed(2) + "%",
//   });

//   const handleSubmitPayment = () => {
//     console.log("🟢 Submitting payment:", {
//       method: paymentMethod,
//       amount,
//       phone,
//     });
//     alert(`Payment submitted: ${amount} F via ${paymentMethod}`);
//     setPaymentModalVisible(false);
//   };

//   console.log("📊 Render decision:", {
//     loading,
//     hasFees: !!fees,
//     feesId: fees?.id,
//   });

//   return (
//     <View style={{ flex: 1, backgroundColor: COLORS.background }}>
//       <AppHeader showBack showTitle />

//       <View style={{ flex: 1 }}>
//         {loading ? (
//           <>
//             {console.log("⏳ Showing loader...")}
//             <ActivityIndicator size="large" color={COLORS.primary} />
//           </>
//         ) : fees?.id ? (
//           <>
//             {console.log("🖼 Rendering fees UI...")}
//             <ScrollView
//               contentContainerStyle={{
//                 padding: 16,
//                 paddingBottom: 60,
//                 paddingTop: 80,
//               }}
//               showsVerticalScrollIndicator={false}
//             >
//               {/* Student Info Card */}
//               <View style={styles.card}>
//                 <View style={styles.cardHeader}>
//                   <Ionicons
//                     name="person-circle"
//                     size={28}
//                     color={COLORS.primary}
//                   />
//                   <Text style={styles.cardTitle}>
//                     {fees?.userprofile?.customuser?.fullName}
//                   </Text>
//                 </View>

//                 <View style={styles.row}>
//                   <Text style={styles.label}>{t("fees.level")}:</Text>
//                   <Text style={styles.value}>
//                     {fees?.userprofile?.specialty?.level?.level}
//                   </Text>
//                 </View>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>{t("fees.matricule")}:</Text>
//                   <Text style={styles.value}>
//                     {fees?.userprofile?.customuser?.matricle}
//                   </Text>
//                 </View>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>{t("fees.specialty")}:</Text>
//                   <Text style={styles.value}>
//                     {fees.userprofile?.specialty?.mainSpecialty?.specialtyName}
//                   </Text>
//                 </View>
//                 <View style={styles.row}>
//                   <Text style={styles.label}>{t("fees.academicYear")}:</Text>
//                   <Text style={styles.value}>
//                     {fees.userprofile?.specialty?.academicYear}
//                   </Text>
//                 </View>
//               </View>
//               {/* ... rest of UI unchanged ... */}
//             </ScrollView>
//           </>
//         ) : (
//           <>
//             {console.log("🚫 No fees data found, showing fallback")}
//             <Text style={{ textAlign: "center", marginTop: 20 }}>
//               {t("fees.noInfo")}
//             </Text>
//           </>
//         )}

//         {fees ? (
//           <ModalMoratorium
//             fees={fees}
//             modalVisible={modalVisible}
//             setModalVisible={setModalVisible}
//           />
//         ) : null}
//       </View>
//     </View>
//   );
// };

// export default Fees;

// // --- same styles & query as before ---
// const GET_DATA = gql`
//   query GetData($userprofileId: Decimal!) {
//     allSchoolFees(userprofileId: $userprofileId) {
//       edges {
//         node {
//           id
//           balance
//           userprofile {
//             customuser {
//               id
//               fullName
//               matricle
//             }
//             specialty {
//               id
//               academicYear
//               mainSpecialty {
//                 specialtyName
//               }
//               level {
//                 level
//               }
//               registration
//               tuition
//               paymentOne
//               paymentTwo
//               paymentThree
//             }
//           }
//           platformPaid
//           idPaid
//           transactions {
//             id
//             amount
//             reason
//             ref
//             createdAt
//           }
//           moratoires {
//             id
//             reason
//             status
//             requestedSchedule {
//               amount
//               dueDate
//             }
//             approvedSchedule {
//               amount
//               dueDate
//             }
//           }
//         }
//       }
//     }
//   }
// `;
