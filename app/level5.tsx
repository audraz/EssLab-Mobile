import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";

const { width: screenWidth } = Dimensions.get("window");

const Level5Page = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/level5quiz");
  };

  const handleBack = () => {
    router.push("/homepage");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Image
            source={require("../assets/x.png")}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>
      </View>

      {/* Video Section */}
      <View style={styles.videoContainer}>
        <WebView
          source={{
            uri: "https://www.youtube.com/embed/1DltMnjPr1k?si=AvXZosN57h75bDcC",
          }}
          style={styles.video}
          allowsFullscreenVideo
        />
      </View>

      {/* Title and Summary */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Persuasive Essay</Text>
        <Text style={styles.summary}>
            This video explains how to write a persuasive essay, which is used to express opinions and convince readers to agree with a specific viewpoint. Persuasive writing involves a clear claim, supported by reasons and backed up by evidence. The essay structure includes an introduction, body paragraphs, and a conclusion. In the introduction, the writer presents their claim, supported by the first reason and relevant evidence. Additional body paragraphs offer more reasons and evidence, and an optional counter-argument paragraph can strengthen the argument by addressing opposing views. The conclusion restates the claim, summarizes key reasons, and calls the reader to action. Key steps for writing a persuasive essay include identifying the audience, choosing a topic, stating a clear position, providing reasons, supporting these reasons with evidence, and organizing the writing effectively. Editing and revising are essential before sharing the final draft.
        </Text>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.nextContainer}>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Complete Video</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Level5Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFF",
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  backButton: {
    padding: 10,
    zIndex: 1000,
  },
  backButtonImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  videoContainer: {
    width: screenWidth - 40,
    height: screenWidth * 0.5625,
    alignSelf: "center",
    marginBottom: 20,
  },
  video: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "left",
    fontFamily: "Italiana",
  },
  summary: {
    fontSize: 16,
    lineHeight: 22,
    color: "#555",
    textAlign: "justify",
    marginBottom: 20,
  },
  nextContainer: {
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#006B49",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
