import COLORS from "@/constants/colors";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Linking,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";


export default function CheckUserScreen() {
  const router = useRouter();
  const {schoolIdentification} = useAuthStore();
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    if (!username.trim()) {
      alert("Please enter your matricule or username");
      return;
    }
    // TODO: call API
    console.log("Check user:", username);
  };

  const handleSupport = () => {
    const phoneNumber = "237673351854"; 
    const message = "Hello, I need help checking my account.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* School Name */}
        <Text style={styles.schoolName}> {schoolIdentification?.name || "my school"} </Text>

        {/* Title */}
        <Text style={styles.title}>Check User</Text>

        {/* Label */}
        <Text style={styles.label}>Matricule or Username</Text>

        {/* Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter matricule or username"
          placeholderTextColor={COLORS.placeholderText}
          value={username}
          onChangeText={setUsername}
        />

        {/* Back to Login */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Check Now</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer */}
        <TouchableOpacity onPress={handleSupport}>
          <Text style={styles.link}>Contact Support</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>@2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 12,
  },
  link: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
});
