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

const Level4Page = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/level4quiz");
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
            uri: "https://www.youtube.com/embed/1eP5Euwk7GU?si=nErWOBQMgyXCF_NW",
          }}
          style={styles.video}
          allowsFullscreenVideo
        />
      </View>

      {/* Title and Summary */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Expository Essay</Text>
        <Text style={styles.summary}>
            This video explains how to write an expository essay, highlighting key differences from argumentative essays. Unlike argumentative essays, which take a stance on an issue, expository essays focus on explaining, clarifying, and providing balanced information about a topic without expressing personal opinions. The expository essay structure includes an introduction, orientation, body, and conclusion. In the introduction, the writer presents the topic and thesis statement without suggesting actions. The orientation paragraph defines terms and concepts, while the body expands on the topic with various paragraph types, such as descriptions, definitions, comparisons, cause and effect, and real-life examples. Body paragraphs in expository essays should avoid opinions and judgments, providing factual analysis instead. Finally, the conclusion reiterates the topic's importance, restates the thesis, and reflects on its real-world implications. The video also offers downloadable templates with thesis examples and paragraph starters to assist in structuring an expository essay.
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

export default Level4Page;

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
