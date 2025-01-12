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
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../config/firebaseConfig";
import { updateProfile, updatePassword, signOut } from "firebase/auth";

const { width: screenWidth } = Dimensions.get("window");

const ProfilePage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activePage, setActivePage] = useState("/profile");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
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
      if (!name && !password) {
        Alert.alert("No Changes", "Please make some changes before saving.");
        return;
      }

      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");

      if (name && name !== user.displayName) {
        await updateProfile(user, { displayName: name });
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
      Alert.alert("Logged Out", "You have been logged out successfully.");
      router.push("/login");
    } catch (error) {
      Alert.alert(
        "Logout Failed",
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  const handleNavigation = (path: "/homepage" | "/profile") => {
    setActivePage(path);
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                  placeholder="Your email"
                  value={email}
                  editable={false}
                  selectTextOnFocus={false}
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
              {/* Tombol Logout */}
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => handleNavigation("/homepage")}
          style={[
            styles.navbarButton,
            activePage === "/homepage" && styles.activeNavItem,
          ]}
        >
          <View style={styles.navIndicatorWrapper}>
            {activePage === "/homepage" && <View style={styles.navIndicator} />}
          </View>
          <Image source={require("../assets/home.png")} style={styles.icon} />
          <Text
            style={[
              styles.navbarText,
              activePage === "/homepage" && styles.activeNavText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleNavigation("/profile")}
          style={[
            styles.navbarButton,
            activePage === "/profile" && styles.activeNavItem,
          ]}
        >
          <View style={styles.navIndicatorWrapper}>
            {activePage === "/profile" && <View style={styles.navIndicator} />}
          </View>
          <Image
            source={require("../assets/profile.png")}
            style={styles.icon}
          />
          <Text
            style={[
              styles.navbarText,
              activePage === "/profile" && styles.activeNavText,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  profileWrapper: {
    alignItems: "center",
    marginTop: 30,
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
  logoutButton: {
    backgroundColor: "#FF4D4F",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  logoutButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDD",
  },
  navbarButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column", 
    flexBasis: screenWidth * 0.3, 
  },
  navbarText: {
    marginTop: 5,
    color: "#006B49",
    fontSize: screenWidth * 0.035,
  },
  icon: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    resizeMode: "contain",
  },
  navIndicatorWrapper: {
    position: "absolute",
    top: -12, 
    width: "100%", 
    height: 4, 
    alignItems: "center", 
  },
  navIndicator: {
    width: "90%", 
    height: "100%", 
    backgroundColor: "#006B49", 
    borderRadius: 2, 
  },
  activeNavItem: {
    backgroundColor: "#D4EFDF", 
    borderRadius: 15,
    paddingVertical: 10,
    width: screenWidth * 0.5, 
  },
  activeNavText: {
    color: "#006B49",
    fontWeight: "bold",
  },
});

export default ProfilePage;