import React, { useEffect, useState } from "react";
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

const levels = [
  { level: 1, title: "Introduction to Essay" },
  { level: 2, title: "Descriptive Essay" },
  { level: 3, title: "Narrative Essay" },
  { level: 4, title: "Expository Essay" },
  { level: 5, title: "Persuasive Essay" },
  { level: 6, title: "Argumentative Essay" },
];

const HomePage = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]); 
  const [userId, setUserId] = useState<string | null>(null);

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

    const fetchProgress = async (uid: string) => {
      try {
        const userDoc = await getDoc(doc(firestore, "users", uid));
        if (userDoc.exists()) {
          const progress = userDoc.data()?.progress || {};
          const unlocked = Object.keys(progress)
            .filter((key) => progress[key])
            .map((key) => parseInt(key.split("_")[1], 10));
          setUnlockedLevels([1, ...unlocked]); 
        } else {
          console.error("No user progress found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserName(user.uid);
        fetchProgress(user.uid);
      } else {
        setUserId(null);
        setUserName("User");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLevelClick = (level: number) => {
    if (unlockedLevels.includes(level)) {
      const validPath = `/level${level}` as `/level${1 | 2 | 3 | 4 | 5 | 6}`;
      router.push(validPath);
    } else {
      Alert.alert("Level Locked", "Complete the previous levels to unlock this one.");
    }
  };

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
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View style={styles.nav}>
          <TouchableOpacity
            onPress={() => router.push("/homepage")}
            style={[styles.navButton, styles.activeNavButton]}
          >
            <Image source={require("../assets/home.png")} style={styles.icon} />
            <Text style={[styles.navButtonText, styles.activeNavButtonText]}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/profile")} style={styles.navButton}>
            <Image source={require("../assets/profile.png")} style={styles.icon} />
            <Text style={styles.navButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
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
          step-by-step through different essay styles. Ready to start your journey?
        </Text>
        <View style={styles.imageContainer}>
          <Image source={require("../assets/image.png")} style={styles.responsiveImage} />
        </View>
      </View>

      {/* Roadmap Levels */}
      <View style={styles.roadmapPath}>
        {levels.map((level) => (
          <View style={styles.roadmapLevel} key={level.level}>
            <TouchableOpacity
              style={[
                styles.levelCircle,
                unlockedLevels.includes(level.level) ? styles.unlocked : styles.locked,
              ]}
              onPress={() => handleLevelClick(level.level)}
            >
              <Text style={styles.levelText}>{level.level}</Text>
            </TouchableOpacity>
            <Text style={styles.levelTitle}>{level.title}</Text>
          </View>
        ))}
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
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
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
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 24,
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
  roadmapPath: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  roadmapLevel: {
    alignItems: "center",
    marginBottom: 30,
  },
  levelCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  unlocked: {
    backgroundColor: "#DE85C7",
  },
  locked: {
    backgroundColor: "#CCC",
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  levelTitle: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
});

export default HomePage;