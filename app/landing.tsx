import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const LandingPage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>

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
      </View>

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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  logoContainer: {
    flexShrink: 0,
  },
  logo: {
    width: 150,
    height: 50,
  },
  button: {
    backgroundColor: "#006B49",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  slogan: {
    width: screenWidth * 0.8,
    height: 200,
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    maxWidth: 600,
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
