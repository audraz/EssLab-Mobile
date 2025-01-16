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

const Level2Page = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [videoWatched, setVideoWatched] = useState(false);

  const handleWebViewMessage = (event: any) => {
    const message = event.nativeEvent.data;
    if (message === "videoPlaying") {
      setVideoWatched(true);
    }
  };

  const handleNext = () => {
    if (videoWatched) {
      router.push("/level2quiz");
    } else {
      Alert.alert("Watch Video", "You need to start the video first!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, isLandscape && styles.scrollContainerLandscape]}>
        <View style={[styles.header, isLandscape && styles.headerLandscape]}>
          <TouchableOpacity onPress={() => router.push("/homepage")} style={styles.backButton}>
            <Image source={require("../assets/x.png")} style={styles.backButtonImage} />
          </TouchableOpacity>
        </View>
        <View style={[styles.videoContainer, isLandscape && { width: width * 0.8, height: width * 0.45 }]}>
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
                          videoId: 'cXwEGwgGeuw',
                          events: {
                            onStateChange: onPlayerStateChange,
                          },
                        });
                      }
                      function onPlayerStateChange(event) {
                        if (event.data === YT.PlayerState.PLAYING) {
                          window.ReactNativeWebView.postMessage('videoPlaying');
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
        <View style={[styles.content, isLandscape && styles.contentLandscape]}>
          <Text style={styles.title}>Descriptive Essay</Text>
          <Text style={styles.summary}>
            This presentation explains how to write descriptive text, which aims
            to create a vivid picture in the reader's mind by describing a person,
            place, thing, or event. Descriptive writing engages the five senses
            (sight, sound, taste, smell, touch) to make the reader feel as if they
            are part of the scene. The video highlights three techniques: sensory
            details, "show, don’t tell," and figurative language. Sensory details
            bring writing to life by making descriptions more vivid. "Show, don’t
            tell" encourages showing actions and feelings rather than simply
            stating them. Figurative language, such as similes and metaphors, adds
            creativity by comparing things in memorable ways. The steps for
            writing a descriptive essay include choosing a topic, brainstorming
            ideas using the five senses, creating an engaging introduction, using
            organized and detailed body paragraphs, and finishing with a
            conclusion that ties everything together. The process ends with
            editing and sharing the work.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.nextContainer, isLandscape && styles.nextContainerLandscape]}>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Continue to Quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Level2Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFF",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  scrollContainerLandscape: {
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
