import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { decodeUrlID } from "@/utils/functions";
import { NodeCustomUser, EdgeCustomUser } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { JSX } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";


export default function SelectYearScreen(): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const { parentNumber } = useAuthStore();

  const { data: dataProfiles } = useQuery(GET_USERS, {
    variables: { parentTelephone: parentNumber },
    skip: !parentNumber,
  });

  const handleSelect = (
    item: NodeCustomUser,
  ) => {

    router.replace({
      pathname: `/(auth)/select-profile`,
      params: { user_id: decodeUrlID(item.id) }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("Select A Child")}</Text>

      {dataProfiles?.allCustomusers?.edges?.length ? (
        <FlatList<EdgeCustomUser>
          data={dataProfiles?.allCustomusers?.edges ?? []}
          keyExtractor={(item) => item.node.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelect(item?.node)}
            >
              <Text style={styles.title}>
                <Ionicons name="school-outline" size={16} />{" "}
                {item.node.preinscriptionStudent?.fullName}
              </Text>
              <Text style={styles.text}>
                <Ionicons name="calendar-outline" size={16} /> {t("academic.year")}:{" "}
                {item.node.matricle}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  header: TextStyle;
  card: ViewStyle;
  title: TextStyle;
  text: TextStyle;
}>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
});


const GET_USERS = gql`
  query GetData(
    $parentTelephone: String!
  ) {
    allCustomusers(
      parentTelephone: $parentTelephone
    ) {
      edges {
        node {
          id matricle
          preinscriptionStudent {
            fullName
          }
        }
      }
    }
  }
`;
