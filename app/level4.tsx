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
import { WebView, WebViewMessageEvent } from "react-native-webview";

const Level4Page = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [videoWatched, setVideoWatched] = useState(false);

  const handleNext = () => {
    if (videoWatched) {
      router.push("/level4quiz");
    } else {
      Alert.alert("Watch Video", "You have to watch the video first.");
    }
  };

  const handleBack = () => {
    router.push("/homepage");
  };

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    const message = event.nativeEvent.data;
    if (message === "videoPlaying" || message === "videoEnded") {
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
                          videoId: '1eP5Euwk7GU',
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
            javaScriptEnabled
            domStorageEnabled
            onMessage={handleWebViewMessage}
          />
        </View>
        <View style={[styles.content, isLandscape && styles.contentLandscape]}>
          <Text style={styles.title}>Expository Essay</Text>
          <Text style={styles.summary}>
            This video explains how to write an expository essay, highlighting key differences from argumentative essays.
            Unlike argumentative essays, which take a stance on an issue, expository essays focus on explaining,
            clarifying, and providing balanced information about a topic without expressing personal opinions. The
            expository essay structure includes an introduction, orientation, body, and conclusion. In the introduction,
            the writer presents the topic and thesis statement without suggesting actions. The orientation paragraph
            defines terms and concepts, while the body expands on the topic with various paragraph types, such as
            descriptions, definitions, comparisons, cause and effect, and real-life examples. Body paragraphs in
            expository essays should avoid opinions and judgments, providing factual analysis instead. Finally, the
            conclusion reiterates the topic's importance, restates the thesis, and reflects on its real-world
            implications. The video also offers downloadable templates with thesis examples and paragraph starters to
            assist in structuring an expository essay.
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

export default Level4Page;

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