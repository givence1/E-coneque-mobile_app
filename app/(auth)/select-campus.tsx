import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { decodeUrlID } from "@/utils/functions";
import { EdgeSchoolHigherInfo } from "@/utils/schemas/interfaceGraphql";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import React, { JSX } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";


export default function SelectCampusScreen(): JSX.Element {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: dataSchools, loading, error } = useQuery(GET_DATA);

  const mySchools = dataSchools?.allSchoolInfos?.edges?.filter((sch: EdgeSchoolHigherInfo) => user?.school?.includes(parseInt(decodeUrlID(sch.node.id) || "")));
  const schoolTypes = mySchools?.map((sch: EdgeSchoolHigherInfo) => sch?.node?.schoolType?.slice(-1));

  const handleSelect = (item: EdgeSchoolHigherInfo): void => {
    router.replace({
      pathname: "/(tabteacher)",
      params: { schoolId: item.node.id, schoolType: item.node.schoolType },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Campus</Text>

      {loading ? <ActivityIndicator />

        :

        <FlatList
          data={mySchools}
          keyExtractor={(item) => item.node.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
              <Text style={styles.title} >
                {item.node.schoolName}
              </Text>
              <Text style={styles.text}>
                {item.node.town} - {item.node.address}
              </Text>
              <Text style={styles.text}>
                {item.node.campus.replace("_", "-")}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      }

    </View>
  );
}



const GET_DATA = gql`
  query GetData {
    allSchoolInfos {
      edges {
        node {
          id schoolName address town telephone
          schoolType campus
        }
      }
    }
  }
`;



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