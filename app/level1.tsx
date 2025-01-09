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

const Level1Page = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/level1quiz");
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
            uri: "https://www.youtube.com/embed/UuOWNNvupik?si=pgYJ4sQ0GYcgIi66",
          }}
          style={styles.video}
          allowsFullscreenVideo
        />
      </View>

      {/* Title and Summary */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Introduction to Essay</Text>
        <Text style={styles.summary}>
          This video is the first part of a crash course on essay writing,
          aimed at helping viewers master academic essay techniques. An essay
          consists of three main stages: preparation, writing, and revision. In
          the preparation stage, viewers need to understand the assignment,
          choose a topic, and create an initial thesis. The writing stage
          starts with an introduction, where the writer should grab the
          reader’s attention, provide context, and state the thesis. The body
          section contains arguments supporting the thesis, divided into
          paragraphs with each paragraph focusing on a single main idea, backed
          by evidence. In the final paragraph, the conclusion, viewers should
          summarize their main arguments and emphasize the importance of their
          viewpoint. The last stage, revision, includes checking grammar,
          structure, and using a plagiarism checker if sources are cited.
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

export default Level1Page;

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
