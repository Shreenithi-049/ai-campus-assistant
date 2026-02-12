import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function StudentHome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Campus Assistant 🎓</Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Academic")}>
        <Text style={styles.cardText}>Academic Information</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Admin")}>
        <Text style={styles.cardText}>Administrative Info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Events")}>
        <Text style={styles.cardText}>Events & Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Chat")}>
        <Text style={styles.cardText}>AI Chatbot</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f6ff"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#4e73df",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15
  },
  cardText: {
    color: "white",
    fontSize: 16
  }
});
