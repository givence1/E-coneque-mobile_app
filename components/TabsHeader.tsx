import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function Header(): JSX.Element {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const toggleSearch = (): void => {
    setShowSearch((prev) => !prev);
    setSearchText("");
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Left Section */}
        <View style={styles.left}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Image
            source={require("../assets/images/i.jpg")} // replace with your logo path
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Right Section */}
        <View style={styles.right}>
          <TouchableOpacity style={styles.icon} onPress={toggleSearch}>
            <Feather name="search" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name="notifications-outline" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <MaterialIcons name="help-outline" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profile}>
            <Ionicons name="person-circle-outline" size={26} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#777"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 99,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? 40 : 50,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",

    height: Platform.OS === "android" ? 70 : 80,

    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 24,
    marginLeft: 12,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 6,
  },
  profile: {
    marginLeft: 6,
  },
  searchBar: {
    marginTop: 6,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#000",
  },
});
