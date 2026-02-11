import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useContacts } from "../../hooks/useContacts";
import { Colors } from "../../constants/colors";

export default function Contacts() {
  const { contacts, loading, addContact, removeContact, canAddMore, count, max } = useContacts();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!email) {
      Alert.alert("Error", "Email is required.");
      return;
    }
    setSaving(true);
    const { error } = await addContact(name, email);
    setSaving(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setName("");
      setEmail("");
      setShowForm(false);
    }
  }

  async function handleRemove(contactId: string, contactName: string) {
    Alert.alert("Remove Contact", `Remove ${contactName || "this contact"}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const { error } = await removeContact(contactId);
          if (error) Alert.alert("Error", error.message);
        },
      },
    ]);
  }

  return (
    <ImageBackground
      source={require("../../assets/images/ocean-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Check-in</Text>
          <Text style={styles.subtitle}>
            Emergency Contacts ({count}/{max})
          </Text>
        </View>

        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.white} />
          ) : (
            <FlatList
              data={contacts}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={styles.contactCard}>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.name || "No name"}</Text>
                    <Text style={styles.contactEmail}>{item.email}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemove(item.id, item.name || item.email)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeText}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No contacts added yet.</Text>
              }
            />
          )}

          {canAddMore && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowForm(true)}
            >
              <Text style={styles.addButtonText}>+ Add Contact</Text>
            </TouchableOpacity>
          )}
        </View>

        <Modal visible={showForm} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Contact</Text>
              <TextInput
                style={styles.input}
                placeholder="Name (optional)"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowForm(false);
                    setName("");
                    setEmail("");
                  }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAdd}
                  disabled={saving}
                >
                  <Text style={styles.saveText}>
                    {saving ? "Saving..." : "Save"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1, backgroundColor: Colors.overlayDark },
  header: { paddingTop: 60, paddingHorizontal: 20, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.textLight },
  subtitle: { fontSize: 14, color: Colors.textLight, opacity: 0.8, marginTop: 4 },
  content: { flex: 1, paddingHorizontal: 20 },
  list: { paddingBottom: 20 },
  contactCard: {
    backgroundColor: Colors.overlayLight,
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: "600", color: Colors.text },
  contactEmail: { fontSize: 14, color: Colors.textMuted, marginTop: 2 },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: { color: Colors.white, fontWeight: "bold", fontSize: 14 },
  emptyText: { color: Colors.textLight, textAlign: "center", marginTop: 40, opacity: 0.7 },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  addButtonText: { color: Colors.textLight, fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: { backgroundColor: Colors.white, borderRadius: 12, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: Colors.text, marginBottom: 16 },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
  },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 8 },
  cancelButton: { flex: 1, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, alignItems: "center" },
  cancelText: { color: Colors.textMuted, fontWeight: "600" },
  saveButton: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: Colors.primary, alignItems: "center" },
  saveText: { color: Colors.textLight, fontWeight: "bold" },
});
