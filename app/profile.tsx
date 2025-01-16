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
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth } from "../config/firebaseConfig";
import { updateProfile, updatePassword, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../config/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const ProfilePage = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height; 
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("/profile");

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        const userDoc = doc(firestore, "users", userId);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || "");
          setEmail(userData.email || "");
          setProfileImage(userData.profileImage || null);
        } else {
          console.error("No user document found!");
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        router.push("/login");
      }
    });

    return unsubscribe;
  }, [router]);

  const handleSave = async () => {
    try {
      if (!name && !password) {
        Alert.alert("No Changes", "Please make some changes before saving.");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Password Mismatch", "Passwords do not match.");
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

      const userDoc = doc(firestore, "users", user.uid);
      await updateDoc(userDoc, {
        name: name || user.displayName,
        profileImage: profileImage,
      });

      Alert.alert("Success", "Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
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

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to allow permission to upload a photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      console.log("Image URI:", result.assets[0].uri); 
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleNavigation = (path: "/homepage" | "/profile") => {
    setActivePage(path);
    router.push(path);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFEFF" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileWrapper}>
          {/* Profile Image */}
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage + "?time=" + new Date().getTime() }
                  : require("../assets/default-profile.png")
              }
              style={styles.profileImage}
              resizeMode="cover"
            />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>

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
                  placeholderTextColor="#000"
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
                  placeholderTextColor="#000"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Change Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#888"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor="#888"
                />
              </View>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
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
            <View
              style={[
                styles.navbar,
                isLandscape && styles.navbarLandscape, 
              ]}
            >
              <TouchableOpacity
                onPress={() => handleNavigation("/homepage")}
                style={[
                  styles.navbarButton,
                  activePage === "/homepage" && {
                    ...styles.activeNavItem,
                    ...(isLandscape && { width: "80%" }), 
                  },
                ]}
              >
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
                  activePage === "/profile" && {
                    ...styles.activeNavItem,
                    ...(isLandscape && { width: "80%" }), 
                  },
                ]}
              >
                <View style={styles.navIndicatorWrapper}>
                  {activePage === "/profile" && <View style={styles.navIndicator} />}
                </View>
                <Image source={require("../assets/profile.png")} style={styles.icon} />
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
    </SafeAreaView>
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
  header: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  headerTitle: {
    fontSize: screenWidth * 0.05,
    color: "#000000",
    fontWeight: "bold",
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
  },
  profileContainer: {
    padding: 20,
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
    paddingVertical: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    color: "#000",
  },
  saveButton: {
    backgroundColor: "#006B49",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
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
  navbarLandscape: {
    borderTopWidth: 1, 
    borderTopColor: "#DDD", 
    width: "117%", 
    left: "0%", 
    flexDirection: "row", 
    justifyContent: "space-evenly", 
    alignItems: "center", 
    paddingVertical: 10, 
  },
  navbarButtonLandscape: {
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",  
  },
  navbarButton: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flexBasis: "30%",
  },
  navbarText: {
    marginTop: 5,
    color: "#006B49",
    fontSize: 14,
  },
  icon: {
    width: 24,
    height: 24,
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
    width: "50%",
  },
  activeNavText: {
    color: "#006B49",
    fontWeight: "bold",
  },
  changePhotoText: {
    marginTop: 8,
    color: "#DE85C7",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProfilePage;
