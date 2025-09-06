import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../../assets/styles/login.styles";
import COLORS from "../../constants/colors";

export default function Login() {
  const [matricle, setMatricle] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [parent, setParent] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { isLoading, login, isCheckingAuth, schoolIdentification, checkAuth } =
    useAuthStore();

  const router = useRouter();

  const handleLogin = async () => {
    if (!parent && matricle.trim().length < 4) {
      Alert.alert(
        "Invalid Input",
        "Matricle/Username must be at least 4 characters long."
      );
      return;
    }

    if (parent && matricle.trim().length < 7) {
      Alert.alert("Invalid Input", "Phone number must be at least 7 digits.");
      return;
    }

    if (password.trim().length < 4) {
      Alert.alert("Invalid Input", "Password must be at least 4 characters long.");
      return;
    }

    try {
      const result = await login({ matricle, password, parent });
      if (!result?.token || result.token.length < 10) {
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleSupport = () => {
    // 👉 Replace with your WhatsApp number
    const phoneNumber = "237673351854";
    const message = "Hello, I need help with my login.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  if (isCheckingAuth) return null;

  if (!schoolIdentification) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}
      >
        <Text style={{ fontSize: 18, color: "red", marginBottom: 12 }}>
          {schoolIdentification || "Check Your Internet Connection."}
        </Text>
        <TouchableOpacity onPress={() => checkAuth()} style={styles.button}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Logo + School Name */}
        <View
          style={{
            alignItems: "center",
            gap: 40,
            paddingTop: 50,
            paddingBottom: 30,
            backgroundColor: COLORS.background,
          }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 28,
              fontWeight: "700",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            {schoolIdentification?.name || "Welcome"}
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.formContainer}>
              {/* Header with Toggle Button */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                {/* Left Title */}
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: COLORS.primary,
                  }}
                >
                  {parent ? "PARENT LOGIN" : "LOGIN"}
                </Text>

                {/* Toggle pill */}
                <TouchableOpacity
                  onPress={() => setParent(!parent)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: COLORS.primary,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 30,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600", marginRight: 6 }}>
                    {parent ? "Retour" : "As Parent"}
                  </Text>
                  <Ionicons
                    name={parent ? "arrow-back" : "arrow-forward"}
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>

              {/* Username / Phone */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name={parent ? "call-outline" : "person-outline"}
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={
                      parent ? "Parent Telephone Number" : "Enter Matricule or Username"
                    }
                    placeholderTextColor={COLORS.placeholderText}
                    value={matricle}
                    onChangeText={setMatricle}
                    keyboardType={parent ? "phone-pad" : "default"}
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={COLORS.placeholderText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Links */}
              <View style={styles.linkRow}>
                <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}>
                  <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/(auth)/enter-token")}>
                  <Text style={styles.linkText}>Enter Token</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {parent ? "Login As Parent" : "Login"}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Support Links */}
              <View style={styles.linkRow}>
                <TouchableOpacity onPress={handleSupport}>
                  <Text style={styles.linkText}>Contact Support</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/(auth)/check-user")}>
                  <Text style={styles.linkText}>Check User</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Link href="/signup" asChild>
                  <TouchableOpacity>
                    <Text style={styles.link}>Register</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
