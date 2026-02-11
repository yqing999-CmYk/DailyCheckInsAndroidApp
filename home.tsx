import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useCheckIn } from "../../hooks/useCheckIn";
import { useAuth } from "../../lib/auth-context";
import { supabase } from "../../lib/supabase";
import { Colors } from "../../constants/colors";

export default function Home() {
  const { user } = useAuth();
  const { todayCheckIn, loading, checking, performCheckIn } = useCheckIn();

  async function handleCheckIn() {
    const { error } = await performCheckIn();
    if (error) {
      Alert.alert("Check-in Failed", error.message);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  const checkedInTime = todayCheckIn
    ? new Date(todayCheckIn.checked_in_at).toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <ImageBackground
      source={require("../../assets/images/ocean-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Check-in</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.signOut}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.white} />
          ) : todayCheckIn ? (
            <View style={styles.statusCard}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.statusText}>Checked in today</Text>
              <Text style={styles.timeText}>at {checkedInTime} ET</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.checkInButton}
              onPress={handleCheckIn}
              disabled={checking}
              activeOpacity={0.8}
            >
              <Text style={styles.checkInButtonText}>
                {checking ? "Checking in..." : "Check In"}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: Colors.overlayDark },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.textLight },
  signOut: { color: Colors.textLight, fontSize: 14, opacity: 0.8 },
  content: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  statusCard: {
    backgroundColor: Colors.overlayLight,
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    width: "100%",
  },
  checkmark: { fontSize: 64, color: Colors.success, marginBottom: 12 },
  statusText: { fontSize: 22, fontWeight: "bold", color: Colors.text },
  timeText: { fontSize: 16, color: Colors.textMuted, marginTop: 4 },
  checkInButton: {
    backgroundColor: Colors.primary,
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkInButtonText: { color: Colors.textLight, fontSize: 24, fontWeight: "bold" },
  userEmail: { color: Colors.textLight, marginTop: 24, opacity: 0.7, fontSize: 14 },
});
