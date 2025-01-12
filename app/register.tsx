import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { auth, firestore } from "../config/firebaseConfig"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const { height: screenHeight } = Dimensions.get("window");

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Validation Error", "All fields are required!");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match!");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await setDoc(doc(firestore, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(), 
      });
  
      Alert.alert("Success", "Signup successful!");
      router.push("homepage"); 
    } catch (error) {
      Alert.alert("Error", error.message || "An unknown error occurred during sign-up.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to EssLab!</Text>
          <Text style={styles.welcomeMessage}>
            Unlock the power of words with EssLab. Join us today to start your journey in mastering the art of essay writing!
          </Text>
        </View>
  
        {/* Sign Up Section */}
        <View style={[styles.signupSection, { paddingBottom: screenHeight * 0.1 }]}>
          <Text style={styles.header}>Get Started</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
            />
  
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
  
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
  
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm Your Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
  
            {/* Custom Sign Up Button */}
            <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
  
          {/* Login Prompt */}
          <Text style={styles.loginPrompt}>
            Already have an account?{" "}
            <TouchableOpacity onPress={() => router.push("login")}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </ScrollView>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEF9",
  },
  welcomeSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#006B49",
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  welcomeMessage: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    maxWidth: 300,
  },
  signupSection: {
    flex: 2,
    padding: 20,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    paddingTop: 40,
  },
  signupButton: {
    backgroundColor: "#006B49", 
    borderWidth: 2, 
    borderColor: "#006B49",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  signupButtonText: {
    color: "#FFF", 
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  loginPrompt: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  loginLink: {
    color: "#DE85C7",
    textDecorationLine: "underline",
  },
});
