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

const Level3Page = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [videoWatched, setVideoWatched] = useState(false);

  const handleNext = () => {
    if (videoWatched) {
      router.push("/level3quiz");
    } else {
      Alert.alert("Watch Video", "You need to start the video first!");
    }
  };

  const handleBack = () => {
    router.push("/homepage");
  };

  const handleWebViewMessage = (event: any) => {
    const message = event.nativeEvent.data;
    if (message === "videoPlaying") {
      setVideoWatched(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, isLandscape && styles.scrollContainerLandscape]}>
        <View style={[styles.header, isLandscape && styles.headerLandscape]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
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
                          videoId: '-Gl6xqC93RQ',
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
        </View>
        <View style={[styles.nextContainer, isLandscape && styles.nextContainerLandscape]}>
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Continue to Quiz</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Level3Page;

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