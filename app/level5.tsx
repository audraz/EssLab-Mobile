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

const Level5Page = () => {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [videoWatched, setVideoWatched] = useState(false);

  const handleNext = () => {
    if (videoWatched) {
      router.push("/level5quiz");
    } else {
      Alert.alert("Watch Video", "You have to start watching the video first.");
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
                          videoId: '1DltMnjPr1k',
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
        <View style={[styles.content, isLandscape && styles.contentLandscape]}>
          <Text style={styles.title}>Persuasive Essay</Text>
          <Text style={styles.summary}>
            This video explains how to write a persuasive essay, which is used to
            express opinions and convince readers to agree with a specific
            viewpoint. Persuasive writing involves a clear claim, supported by
            reasons and backed up by evidence. The essay structure includes an
            introduction, body paragraphs, and a conclusion. In the introduction,
            the writer presents their claim, supported by the first reason and
            relevant evidence. Additional body paragraphs offer more reasons and
            evidence, and an optional counter-argument paragraph can strengthen
            the argument by addressing opposing views. The conclusion restates
            the claim, summarizes key reasons, and calls the reader to action.
            Key steps for writing a persuasive essay include identifying the
            audience, choosing a topic, stating a clear position, providing
            reasons, supporting these reasons with evidence, and organizing the
            writing effectively. Editing and revising are essential before
            sharing the final draft.
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

export default Level5Page;

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