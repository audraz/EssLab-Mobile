import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../config/firebaseConfig";
import { updateProfile, updateEmail, updatePassword, signOut } from "firebase/auth";

const { width: screenWidth } = Dimensions.get("window");

const ProfilePage = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setName(user.displayName || "");
        setEmail(user.email || "");
      } else {
        Alert.alert("Not Logged In", "You need to log in first.");
        router.push("/login");
      }
    });
    return unsubscribe;
  }, []);

  const handleSave = async () => {
    try {
      if (!name && !email && !password) {
        Alert.alert("No Changes", "Please make some changes before saving.");
        return;
      }

      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      if (name) {
        await updateProfile(user, { displayName: name });
      }
      if (email) {
        await updateEmail(user, email);
      }
      if (password) {
        await updatePassword(user, password);
      }

      Alert.alert("Success", "Profile updated successfully!");
      setPassword("");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      Alert.alert(
        "Logout Failed",
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View style={styles.nav}>
          <TouchableOpacity
            onPress={() => router.push("/homepage")}
            style={styles.navButton}
          >
            <Image source={require("../assets/home.png")} style={styles.icon} />
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/profile")}
            style={[styles.navButton, styles.activeNavButton]}
          >
            <Image
              source={require("../assets/profile.png")}
              style={styles.icon}
            />
            <Text style={[styles.navButtonText, styles.activeNavButtonText]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setMenuOpen(!menuOpen)}
          style={styles.menuButton}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        {menuOpen && (
          <View style={styles.menuDropdown}>
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Profile Form */}
      <View style={styles.profileWrapper}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/profile-img.png")}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFEFF",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    width: "100%",
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  nav: {
    flexDirection: "row",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingBottom: 5,
  },
  navButtonText: {
    marginLeft: 5,
    color: "#006B49",
    fontWeight: "bold",
  },
  activeNavButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#006B49",
  },
  activeNavButtonText: {
    color: "#006B49",
    fontWeight: "bold",
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 18,
    color: "#006B49",
  },
  menuDropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    color: "#FF4D4F",
    fontWeight: "bold",
  },
  profileWrapper: {
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "contain",
  },
  profileContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: screenWidth * 0.9,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
  },
  saveButton: {
    backgroundColor: "#006B49",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default ProfilePage;
