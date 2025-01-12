import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Text,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";

const { width: screenWidth } = Dimensions.get("window");

const Level6Page = () => {
  const router = useRouter();
  const [videoWatched, setVideoWatched] = useState(false);

  const handleNext = () => {
    if (videoWatched) {
      router.push("/level6quiz");
    } else {
      Alert.alert("Watch Video", "You have to watch the video first.");
    }
  };

  const handleBack = () => {
    router.push("/homepage");
  };

  const handleWebViewMessage = (event : any) => {
    const message = event.nativeEvent.data;
    if (message === "videoStarted" || message === "videoPlaying" || message === "videoEnded") {
      setVideoWatched(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
            html: `
              <html>
                <body style="margin: 0; padding: 0; background-color: black;">
                  <script src="https://www.youtube.com/iframe_api"></script>
                  <div id="player"></div>
                  <script>
                    let player;
                    function onYouTubeIframeAPIReady() {
                      player = new YT.Player('player', {
                        height: '100%',
                        width: '100%',
                        videoId: 'oAUKxr946SI',
                        events: {
                          onStateChange: onPlayerStateChange,
                        },
                      });
                    }
                    function onPlayerStateChange(event) {
                      if (event.data === YT.PlayerState.PLAYING) {
                        window.ReactNativeWebView.postMessage('videoPlaying');
                      } else if (event.data === YT.PlayerState.ENDED) {
                        window.ReactNativeWebView.postMessage('videoEnded');
                      }
                    }
                  </script>
                </body>
              </html>
            `,
          }}
          style={styles.video}
          onMessage={handleWebViewMessage}
          javaScriptEnabled
          domStorageEnabled
        />
      </View>

      {/* Title and Summary */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Argumentative Essay</Text>
        <Text style={styles.summary}>
          This video provides a step-by-step guide to writing an argumentative essay, commonly structured with two arguments supporting the writer's opinion and one counter-argument. Known as the "hamburger essay," this format includes an introduction, three body paragraphs, and a conclusion. To begin, it's essential to analyze the essay question for clues that will help shape the response, identifying the subject, purpose, and any required structure, such as word count. Planning is crucial for effective organization. Various planning methods, like spider diagrams, can help generate ideas. To create strong body paragraphs, choose the main points that best support the opinion, each beginning with a clear topic sentence. The counterpoint in one paragraph acknowledges an opposing view, enhancing the argument. The video emphasizes simplicity in layout, analysis, and planning to ensure clarity and organization.
        </Text>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.nextContainer}>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Continue to Quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Level6Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFF",
  },
  header: {
    marginBottom: 20,
    alignItems: "flex-start",
    padding: 10,
  },
  backButton: {
    padding: 10,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "left",
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
    padding: 20,
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