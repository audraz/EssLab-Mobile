import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ScrollView, 
  useWindowDimensions 
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Login Error", "Email and password are required!");
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      Alert.alert("Login Successful", "Welcome back! Redirecting to the homepage...");
      router.push("/homepage");
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
  
        switch (firebaseError.code) {
          case "auth/invalid-email":
            Alert.alert("Login Failed", "Invalid email format. Please check your email.");
            break;
          case "auth/user-not-found":
            Alert.alert("Login Failed", "No account found with this email. Please sign up.");
            break;
          case "auth/wrong-password":
            Alert.alert("Login Failed", "Incorrect password. Please try again.");
            break;
          case "auth/invalid-credential":
            Alert.alert("Login Failed", "Invalid email or password. Please try again.");
            break;
          default:
            Alert.alert("Error", "An error occurred during login. Please try again later.");
        }
      } else {
        Alert.alert("Unknown Error", "An unexpected error occurred. Please contact support.");
      }
    }
  };    

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeMessage}>
            We're glad to see you again! Please log in to continue.
          </Text>
        </View>
  
        {/* Login Section */}
        <View
          style={[
            styles.loginSection,
            { paddingHorizontal: isLandscape ? 16 : 20 }, 
          ]}
        >
          <Text style={styles.header}>Log In</Text>
          <View style={styles.form}>
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
  
            {/* Custom Log In Button */}
            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
  
          {/* Sign Up Prompt */}
          <Text style={styles.signupPrompt}>
            Don't have an account?{" "}
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.signupLink}>Sign up here</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </ScrollView>
    </View>
  );    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEF9",
  },
  scrollContainer: {
    flexGrow: 1,
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
  loginSection: {
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
  },
  loginButton: {
    backgroundColor: "#006B49", 
    borderWidth: 2, 
    borderColor: "#006B49",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
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
  signupPrompt: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  signupLink: {
    color: "#DE85C7",
    textDecorationLine: "underline",
  },
});