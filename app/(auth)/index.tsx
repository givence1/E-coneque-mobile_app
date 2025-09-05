import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import styles from "../../assets/styles/login.styles";
import COLORS from "../../constants/colors";

export default function Login() {
  const [matricle, setMatricle] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [parent, setParent] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { isLoading, login, role, isCheckingAuth, schoolIdentification, checkAuth } =
    useAuthStore();

  const handleLogin = async () => {
    if (matricle.trim().length < 4) {
      Alert.alert("Invalid Input", "Matricle/Username must be at least 4 characters long.");
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

  if (isCheckingAuth) return null;

  if (!schoolIdentification) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // ensures proper push on iOS
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Logo + School Name */}
        {/* <View
          style={{
            alignItems: "center",
            gap: 40,
            paddingTop: 50,
            paddingBottom: 30,
            backgroundColor: COLORS.background,
          }}
        > */}
          {/* <Image
            source={{ uri: `${protocol}${tenant}${RootApi}/media/${schoolIdentification?.logo}` }}
            style={{ width: 120, height: 120, borderRadius: 10 }}
            resizeMode="contain"
          /> */}
          {/* <Text
            style={{
              color: COLORS.primary,
              fontSize: 28,
              fontWeight: "700",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            {schoolIdentification?.name || "Welcome"}
          </Text> */}
        {/* </View> */}  

        {/* Form Card */}
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.formContainer}>
              {/* Role Toggle */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: COLORS.primary, marginRight: 10 }}> Login </Text>
              </View>

              {/* Username */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Matricule or Username"
                    placeholderTextColor={COLORS.placeholderText}
                    value={matricle}
                    onChangeText={setMatricle}
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
                <TouchableOpacity>
                  <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Enter Token</Text>
                </TouchableOpacity>
              </View>

              {/* Login */}
              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Login</Text>
                )}
              </TouchableOpacity>

              {/* Support Links */}
              <View style={styles.linkRow}>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Contact Support</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.linkText}>Check User</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                {/* <Text style={styles.footerText}>Pre Enrollment</Text> */}
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
