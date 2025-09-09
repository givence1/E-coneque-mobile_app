import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type AppHeaderProps = {
  showBack?: boolean;   // arrow back
  showTitle?: boolean;  // centered title
  title?: string;       // optional override
  showTabs?: boolean;   // lecturer/student tabs header
};

export default function AppHeader({ showBack, showTitle, title, showTabs }: AppHeaderProps) {
  const router = useRouter();
  const { user, schoolIdentification } = useAuthStore(); // 👈 now also grab schoolIdentification
  const role = user?.role; // "lecturer" | "student" | "guest"

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Left Section */}
        <View style={styles.left}>
          {showBack && (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Title */}
        {showTitle && (
          <View style={styles.center}>
            <Text style={styles.title}>
              {title || schoolIdentification?.name || "Welcome"}
            </Text>
          </View>
        )}

        {/* Right Section */}
        <View style={styles.right}>
          <TouchableOpacity style={styles.icon}>
            <Ionicons name="notifications-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            onPress={() =>
              role === "lecturer"
                ? router.push("/(tabteacher)/profile")
                : router.push("/(tabstudent)/higher/profile")
            }
          >
            <Ionicons name="person-circle-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Optional Tabs */}
      {showTabs && (
        <View style={styles.tabs}>
          <Text style={{ color: "#fff" }}>Tabs Placeholder</Text>
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
    backgroundColor: COLORS.primary,

    paddingTop: Platform.OS === "android" ? 25 : 35,
    paddingBottom: 6,
    height: Platform.OS === "android" ? 55 : 65,

    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center" },
  center: { flex: 1, alignItems: "center" },
  title: { color: "#fff", fontSize: 13, fontWeight: "700", textAlign: "center", },
  right: { flexDirection: "row", alignItems: "center" },
  icon: { marginHorizontal: 4 },
  tabs: {
    marginTop: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
  },
});
