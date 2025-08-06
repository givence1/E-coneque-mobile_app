import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInput as RNTextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import COLORS from "../constants/colors";

type HeaderProps = {
  placeholder?: string;
};

export default function Header({ placeholder = "Search..." }: HeaderProps) {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const inputRef = useRef<RNTextInput>(null);

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
    setTimeout(() => {
      if (!showSearch && inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.iconLeft} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Search Bar */}
      {showSearch ? (
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.placeholderText}
        />
      ) : (
        <View style={styles.spacer} />
      )}

      {/* Search Icon */}
      <TouchableOpacity style={styles.iconRight} onPress={handleToggleSearch}>
        <Ionicons name="search-outline" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  iconLeft: {
    padding: 1,
  },
  iconRight: {
    padding: 1,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    color: "#333",
  },
  spacer: {
    flex: 1,
  },
});
