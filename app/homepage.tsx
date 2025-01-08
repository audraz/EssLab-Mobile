import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, firestore } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { width: screenWidth } = Dimensions.get("window");

const HomePage = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUserName = async (uid: string) => {
      try {
        const userDoc = await getDoc(doc(firestore, "users", uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || "User");
        } else {
          console.error("No user document found in Firestore.");
          setUserName("User");
        }
      } catch (error) {
        console.error("Error fetching user name from Firestore:", error);
        setUserName("User");
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserName(user.uid);
      } else {
        setUserName("User");
        console.log("No user is logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert("Logged Out", "You have been logged out successfully.");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />
        <View style={styles.nav}>
          <TouchableOpacity
            onPress={() => router.push("/homepage")}
            style={styles.navButton}
          >
            <Image
              source={require("../assets/home.png")}
              style={styles.icon}
            />
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert("Feature Unavailable", "Profile is not available yet.")}
            style={styles.navButton}
          >
            <Image
              source={require("../assets/profile.png")}
              style={styles.icon}
            />
            <Text style={styles.navButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)} style={styles.menuButton}>
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

      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Welcome, {userName}!</Text>
        <Text style={styles.welcomeMessage}>
          Discover the art of essay like never before. Whether you're a beginner
          or looking to refine your writing, you're in the right place!
        </Text>
        <Text style={styles.welcomeMessage}>
          Explore our roadmap of interactive levels, designed to take you
          step-by-step through different essay styles. Each level is tailored to
          build your skills and confidence as a writer. Ready to start your
          journey?
        </Text>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/image.png")}
            style={styles.responsiveImage}
          />
        </View>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Feature Unavailable", "Get Started is not available yet.")
          }
          style={styles.getStartedButton}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  navButtonText: {
    color: "#006B49",
    fontWeight: "bold",
    marginLeft: 5,
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
    right: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    color: "#FF4D4F",
    fontWeight: "bold",
  },
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: "Italiana",
    fontWeight: "bold",
    marginBottom: 10,
  },
  welcomeMessage: {
    fontSize: 16,
    color: "#676767",
    marginBottom: 10,
    textAlign: "justify",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  responsiveImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  getStartedButton: {
    backgroundColor: "#006B49",
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
  },
  getStartedButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomePage;
