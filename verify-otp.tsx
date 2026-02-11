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
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Colors } from "../../constants/colors";

export default function VerifyOtp() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (!token || token.length < 6) {
      Alert.alert("Error", "Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: phone!,
      token,
      type: "sms",
    });
    setLoading(false);
    if (error) Alert.alert("Verification Failed", error.message);
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
          <Text style={styles.subtitle}>Enter Verification Code</Text>
          <Text style={styles.info}>Code sent to {phone}</Text>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="6-digit code"
              placeholderTextColor={Colors.textMuted}
              value={token}
              onChangeText={setToken}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerify}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Verifying..." : "Verify"}
              </Text>
            </TouchableOpacity>
          </View>
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
  subtitle: { fontSize: 18, color: Colors.textLight, textAlign: "center", marginBottom: 8, opacity: 0.9 },
  info: { color: Colors.textLight, textAlign: "center", marginBottom: 24, opacity: 0.7 },
  card: { backgroundColor: Colors.overlayLight, borderRadius: 12, padding: 20, marginBottom: 16 },
  input: { backgroundColor: Colors.white, borderRadius: 8, padding: 14, fontSize: 24, marginBottom: 12, borderWidth: 1, borderColor: Colors.border, color: Colors.text, textAlign: "center", letterSpacing: 8 },
  button: { backgroundColor: Colors.primary, borderRadius: 8, padding: 16, alignItems: "center" },
  buttonText: { color: Colors.textLight, fontSize: 16, fontWeight: "bold" },
});
