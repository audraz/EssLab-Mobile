import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const LandingPage = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height; 

  return (
    <View style={styles.container}>
      {isLandscape ? (
        <ScrollView contentContainerStyle={[styles.mainLandscape]}>
          <Image
            source={require("../assets/slogan.png")}
            style={[styles.slogan, { marginTop: 50 }]} 
            resizeMode="contain"
          />
          <Text
            style={[
              styles.aboutTextLandscape,
              { marginBottom: 30 }, 
            ]}
          >
            EssLab is designed to enhance your essay writing skills through
            interactive learning modules. Explore different types of essays,
            understand their structures, and practice writing with guided
            assistance.
          </Text>
  
          {/* Buttons for Log In and Sign Up */}
          <View
            style={[
              styles.buttonContainerLandscape,
              { marginTop: 10 }, 
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.main}>
          <Image
            source={require("../assets/slogan.png")}
            style={styles.slogan}
            resizeMode="contain"
          />
          <Text style={styles.aboutText}>
            EssLab is designed to enhance your essay writing skills through
            interactive learning modules. Explore different types of essays,
            understand their structures, and practice writing with guided
            assistance.
          </Text>
  
          {/* Buttons for Log In and Sign Up */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
  
      <View style={styles.footer}>
        <Text style={styles.footerText}>&copy; EssLab</Text>
      </View>
    </View>
  );  
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  mainLandscape: {
    alignItems: "center",
    padding: 16,
    marginTop: -20,
  },
  slogan: {
    width: screenWidth * 0.8,
    height: 200,
    marginBottom: 0,
    marginTop: 110,
  },
  aboutText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginHorizontal: 24,
    marginBottom: 90,
  },
  aboutTextLandscape: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginHorizontal: 24,
    marginBottom: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
    marginTop: 50,
  },
  buttonContainerLandscape: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 30,
  },
  button: {
    flex: 1,
    backgroundColor: "#006B49",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  footerText: {
    color: "#333",
    fontSize: 14,
  },
});