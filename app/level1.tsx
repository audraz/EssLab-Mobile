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
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";

const Level1Page = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions(); 
  const isLandscape = width > height; 
  const [videoWatched, setVideoWatched] = useState(false);

  const handleWebViewMessage = (event: any) => {
    const message = event.nativeEvent.data;
    if (message === "videoStarted" || message === "videoPlaying") {
      setVideoWatched(true);
    }
  };

  const handleNext = () => {
    if (videoWatched) {
      router.push("/level1quiz");
    } else {
      Alert.alert("Watch Video", "You need to start the video first!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Konten Scrollable */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isLandscape && styles.scrollContainerLandscape, 
        ]}
      >
        {/* Header */}
        <View style={[styles.header, isLandscape && styles.headerLandscape]}>
          <TouchableOpacity onPress={() => router.push("/homepage")} style={styles.backButton}>
            <Image source={require("../assets/x.png")} style={styles.backButtonImage} />
          </TouchableOpacity>
        </View>

        {/* Video Section */}
        <View
          style={[
            styles.videoContainer,
            isLandscape && { width: width * 0.8, height: width * 0.45 }, 
          ]}
        >
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
                          videoId: 'UuOWNNvupik',
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
        <View style={styles.content}>
          <Text style={styles.title}>Introduction to Essay</Text>
          <Text style={styles.summary}>
            This video is the first part of a crash course on essay writing, aimed at helping viewers master academic essay
            techniques. An essay consists of three main stages: preparation, writing, and revision. In the preparation stage,
            viewers need to understand the assignment, choose a topic, and create an initial thesis. The writing stage starts
            with an introduction, where the writer should grab the reader’s attention, provide context, and state the thesis.
            The body section contains arguments supporting the thesis, divided into paragraphs with each paragraph focusing
            on a single main idea, backed by evidence. In the final paragraph, the conclusion, viewers should summarize their
            main arguments and emphasize the importance of their viewpoint. The last stage, revision, includes checking
            grammar, structure, and using a plagiarism checker if sources are cited.
          </Text>
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={[styles.nextContainer, isLandscape && styles.nextContainerLandscape]}>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Continue to Quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Level1Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFF",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContainerLandscape: {
    flexGrow: 1,
    paddingHorizontal: 20, 
  },
  header: {
    marginBottom: 20,
    alignItems: "flex-start",
    padding: 10,
  },
  headerLandscape: {
    marginBottom: 10, 
    paddingHorizontal: 20,
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
    width: Dimensions.get("window").width - 40,
    height: (Dimensions.get("window").width - 40) * 0.5625,
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
  contentLandscape: {
    paddingHorizontal: 40, 
    paddingBottom: 10,
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
  nextContainerLandscape: {
    paddingHorizontal: 50, 
    paddingVertical: 10,
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