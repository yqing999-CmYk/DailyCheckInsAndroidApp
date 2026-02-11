import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Colors } from "../../constants/colors";

export default function SignIn() {
  const router = useRouter();
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSignIn() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert("Sign In Failed", error.message);
  }

  async function handlePhoneSendOtp() {
    if (!phone) {
      Alert.alert("Error", "Please enter your phone number.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      router.push({ pathname: "/(auth)/verify-otp", params: { phone } });
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/images/ocean-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Text style={styles.title}>Daily Check-in</Text>
          <Text style={styles.subtitle}>Sign In</Text>

          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, mode === "email" && styles.tabActive]}
              onPress={() => setMode("email")}
            >
              <Text style={[styles.tabText, mode === "email" && styles.tabTextActive]}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === "phone" && styles.tabActive]}
              onPress={() => setMode("phone")}
            >
              <Text style={[styles.tabText, mode === "phone" && styles.tabTextActive]}>Phone</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {mode === "email" ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleEmailSignIn}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Phone number (e.g. +1234567890)"
                  placeholderTextColor={Colors.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handlePhoneSendOtp}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Sending..." : "Send OTP"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
            <Text style={styles.link}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: Colors.overlayDark },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  title: { fontSize: 32, fontWeight: "bold", color: Colors.textLight, textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 18, color: Colors.textLight, textAlign: "center", marginBottom: 24, opacity: 0.9 },
  tabRow: { flexDirection: "row", marginBottom: 16, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center" },
  tabActive: { backgroundColor: Colors.white },
  tabText: { color: Colors.textLight, fontWeight: "600" },
  tabTextActive: { color: Colors.primary },
  card: { backgroundColor: Colors.overlayLight, borderRadius: 12, padding: 20, marginBottom: 16 },
  input: { backgroundColor: Colors.white, borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border, color: Colors.text },
  button: { backgroundColor: Colors.primary, borderRadius: 8, padding: 16, alignItems: "center" },
  buttonText: { color: Colors.textLight, fontSize: 16, fontWeight: "bold" },
  link: { color: Colors.textLight, textAlign: "center", marginTop: 8, textDecorationLine: "underline" },
});
