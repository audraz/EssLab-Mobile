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
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { auth, firestore } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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
  const [activePage, setActivePage] = useState("/homepage");

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
            .filter((key) => progress[key] === true)
            .map((key) => parseInt(key.split("_")[1], 10));
          setUnlockedLevels([1, ...unlocked]);
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

  const handleNavigation = (path: "/homepage" | "/profile") => {
    setActivePage(path);
    router.push(path);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome, {userName}!</Text>
          <Text style={styles.welcomeMessage}>
            Discover the art of essay like never before. Whether you're a
            beginner or looking to refine your writing, you're in the right
            place!
          </Text>
          <Text style={styles.welcomeMessage}>
            Explore our roadmap of interactive levels, designed to take you
            step-by-step through different essay styles. Ready to start your
            journey?
          </Text>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/image.png")}
              style={styles.responsiveImage}
            />
          </View>
        </View>

        {/* Roadmap Levels */}
        <View style={styles.roadmapPath}>
          {levels.map((level) => (
            <View style={styles.roadmapLevel} key={level.level}>
              <TouchableOpacity
                style={[
                  styles.levelCircle,
                  unlockedLevels.includes(level.level)
                    ? styles.unlocked
                    : styles.locked,
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
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: screenWidth * 0.05,
    marginVertical: 20,
    padding: screenWidth * 0.05,
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
    fontSize: screenWidth * 0.06,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  welcomeMessage: {
    fontSize: screenWidth * 0.04,
    color: "#676767",
    marginBottom: 10,
    textAlign: "justify",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  responsiveImage: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
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
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    borderRadius: screenWidth * 0.1,
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
    fontSize: screenWidth * 0.05,
    fontWeight: "bold",
  },
  levelTitle: {
    fontSize: screenWidth * 0.04,
    color: "#333",
    textAlign: "center",
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

export default HomePage;