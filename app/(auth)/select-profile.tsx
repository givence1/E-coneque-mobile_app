import { useAuthStore } from "@/store/authStore";
import { decodeUrlID } from "@/utils/functions";
import { EdgeSchoolFees, NodeSchoolHigherInfo } from "@/utils/schemas/interfaceGraphql";
import { EdgeSchoolFeesPrim } from "@/utils/schemas/interfaceGraphqlPrimary";
import { EdgeSchoolFeesSec } from "@/utils/schemas/interfaceGraphqlSecondary";
import { gql, useQuery } from "@apollo/client";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
import COLORS from "../../constants/colors";

export default function SelectYearScreen(): JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, storeFeesId, storeProfileId, storeCampusInfo } = useAuthStore();

  const { data: dataProfiles } = useQuery(GET_PROFILES, {
    variables: { customuserId: user?.user_id },
  });

  const handleSelect = (
    item: EdgeSchoolFees | EdgeSchoolFeesSec | EdgeSchoolFeesPrim,
    section: "higher" | "secondary" | "primary"
  ): void => {
    const feesId = parseInt(decodeUrlID(item.node.id.toString()) || "");
    storeFeesId(feesId);

    let profileId: string | undefined;
    let campus: NodeSchoolHigherInfo | undefined;

    if ("userprofile" in item.node) {
      profileId = item.node.userprofile?.id?.toString();
      campus = item.node.userprofile?.specialty?.school;
    } else if ("userprofilesec" in item.node) {
      profileId = item.node.userprofilesec?.id?.toString();
      campus = item.node.userprofilesec?.classroomsec?.school;
    } else if ("userprofileprim" in item.node) {
      profileId = item.node.userprofileprim?.id?.toString();
      campus = item.node.userprofileprim?.classroomprim?.school;
    }

    if (profileId) {
      storeProfileId(parseInt(decodeUrlID(profileId) || ""));
    }
    if (campus) {
      storeCampusInfo(campus);
    }
    router.replace({
      pathname: `/(tabstudent)/${section}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("academic.selectYear")}</Text>

      {dataProfiles?.allSchoolFees?.edges?.length ? (
        <FlatList<EdgeSchoolFees>
          data={dataProfiles?.allSchoolFees?.edges ?? []}
          keyExtractor={(item) => item.node.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelect(item, "higher")}
            >
              <Text style={styles.title}>
                <Ionicons name="school-outline" size={16} />{" "}
                {item.node.userprofile?.specialty?.mainSpecialty?.specialtyName}
              </Text>
              <Text style={styles.text}>
                <Ionicons name="calendar-outline" size={16} /> {t("academic.year")}:{" "}
                {item.node.userprofile?.specialty?.academicYear}
              </Text>
              <Text style={styles.text}>
                <Ionicons name="layers-outline" size={16} /> {t("academic.level")}:{" "}
                {item.node.userprofile?.specialty?.level?.level}
              </Text>
              <Text style={styles.text}>
                <MaterialCommunityIcons name="book-outline" size={16} />{" "}
                {t("academic.program")}: {item.node.userprofile?.program?.name}
                {item.node.platformPaid ? (
                  <Text
                    style={{
                      color: "green",
                      fontWeight: "bold",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="checkmark-circle" size={16} color="green" />{" "}
                    {t("status.active")}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name="close-circle" size={16} color="red" />{" "}
                    {t("status.inactive")}
                  </Text>
                )}
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
    backgroundColor: "#E3F0FF",
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
    color: "#333",
    marginBottom: 4,
  },
});

const GET_PROFILES = gql`
  query GetData($customuserId: Decimal!) {
    allSchoolFees(customuserId: $customuserId) {
      edges {
        node {
          id
          platformPaid
          userprofile {
            id
            program {
              name
            }
            customuser {
              id
              matricle
              fullName
            }
            specialty {
              academicYear
              level {
                level
              }
              mainSpecialty {
                specialtyName
              }
              school {
                id
                schoolName
                town
                address
                telephone
                country
                caLimit
                examLimit
                resitLimit
                seqLimit
              }
            }
          }
        }
      }
    }
    allSchoolFeesSec(customuserId: $customuserId) {
      edges {
        node {
          id
          platformPaid
          userprofilesec {
            id
            customuser {
              id
              matricle
              fullName
            }
            classroomsec {
              school {
                id
                schoolName
                town
                address
                telephone
                country
                caLimit
                examLimit
                resitLimit
                seqLimit
              }
            }
          }
        }
      }
    }
    allSchoolFeesPrim(customuserId: $customuserId) {
      edges {
        node {
          id
          platformPaid
          userprofileprim {
            id
            customuser {
              id
              matricle
              fullName
            }
            classroomprim {
              school {
                id
                schoolName
                town
                address
                telephone
                country
                caLimit
                examLimit
                resitLimit
                seqLimit
              }
            }
          }
        }
      }
    }
  }
`;