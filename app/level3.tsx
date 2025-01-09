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

const Level3Page = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/level3quiz");
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
            uri: "https://www.youtube.com/embed/-Gl6xqC93RQ?si=PRMiYp-cGHSoH3QC",
          }}
          style={styles.video}
          allowsFullscreenVideo
        />
      </View>

      {/* Title and Summary */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Narrative Essay</Text>
        <Text style={styles.summary}>
          The presentation introduces the concept of a narration essay, which
          is also known as a personal experience essay. Narration essays tell a
          story about a specific event in the writer's life and aim to convey a
          particular point or lesson to the reader. The narration must be
          focused, organized, and have a clear purpose that resonates with the
          audience. Unlike a journal entry, it should follow a structured
          format with an introduction, thesis statement, body, and conclusion.
          Topics for narration essays often involve memorable or impactful
          personal experiences. The speaker explains chronological order
          (beginning, middle, end) and the use of time-related transition words
          to help the reader follow the story's flow. Tips for writing
          narration essays include staying organized, focusing on descriptive
          language, and using an implied or direct thesis statement to clarify
          the essay’s purpose.
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

export default Level3Page;

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
