import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, firestore } from "../config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const { width: screenWidth } = Dimensions.get("window");

const questions = [
  {
    id: 1,
    question: "What is the main purpose of an academic essay?",
    options: [
      "To entertain the reader.",
      "To persuade the reader of a position or perspective through arguments supported by evidence and analysis.",
      "To critique other academic works.",
      "To explain information very briefly.",
    ],
    correct: 1,
  },
  {
    id: 2,
    question: "What is the first stage in the essay writing process?",
    options: ["Writing.", "Revision.", "Preparation.", "Making a conclusion."],
    correct: 2,
  },
  {
    id: 3,
    question: "What should be done in the preparation stage?",
    options: [
      "Making a conclusion and structuring arguments.",
      "Structuring the essay with a clear outline.",
      "Understanding the assignment, choosing a topic, and creating an initial thesis.",
      "Checking grammar and formatting.",
    ],
    correct: 2,
  },
  {
    id: 4,
    question: "In the body of the essay, each paragraph should focus on?",
    options: [
      "Arguments supporting the thesis.",
      "Personal experiences of the writer.",
      "Concluding the topic.",
      "Presenting irrelevant evidence.",
    ],
    correct: 1,
  },
  {
    id: 5,
    question: "What should be included in the conclusion of an essay?",
    options: [
      "Additional evidence details",
      "A summary of the main arguments and emphasizing the importance of the writer’s viewpoint",
      "A repeated thesis without change",
      "A further explanation of the background of the topic",
    ],
    correct: 2,
  },
];

const progressIncrement = 100 / questions.length;

const Level1Quiz = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number | undefined }>({});
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        loadAnswers(user.uid);
      } else {
        Alert.alert("Error", "User not logged in.");
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const loadAnswers = async (uid: string) => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const savedAnswers = userData?.answers?.level_1 || {};
        setAnswers(savedAnswers);
        setProgress(Object.keys(savedAnswers).length * progressIncrement);
      }
    } catch (error) {
      console.error("Error loading answers:", error);
    }
  };

  const saveAnswer = async (questionIndex: number, answerIndex: number) => {
    if (!userId) return;
    try {
      const userDocRef = doc(firestore, "users", userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const currentData = userSnapshot.data();
        const updatedAnswers = {
          ...currentData.answers,
          level_1: {
            ...(currentData.answers?.level_1 || {}),
            [questionIndex]: answerIndex,
          },
        };

        await setDoc(
          userDocRef,
          {
            answers: updatedAnswers,
          },
          { merge: true }
        );
      } else {
        await setDoc(
          userDocRef,
          {
            answers: {
              level_1: {
                [questionIndex]: answerIndex,
              },
            },
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const handleOptionClick = (index: number) => {
    setAnswers({ ...answers, [currentQuestion]: index });
    saveAnswer(currentQuestion, index);

    if (currentQuestion === questions.length - 1) {
      setProgress(100);
      setShowModal(true);
    } else {
      setProgress((prev) => prev + progressIncrement);
    }
  };

  const handleRetry = async () => {
    if (!userId) return;
    try {
      const userDocRef = doc(firestore, "users", userId);
      await setDoc(
        userDocRef,
        {
          answers: {
            level_1: {},
          },
        },
        { merge: true }
      );
      setCurrentQuestion(0);
      setProgress(0);
      setAnswers({});
      setShowModal(false);
    } catch (error) {
      console.error("Error resetting answers:", error);
    }
  };

  const updateProgress = async () => {
    if (!userId) return;
  
    try {
      const userDocRef = doc(firestore, "users", userId);
      const userSnapshot = await getDoc(userDocRef);
  
      if (userSnapshot.exists()) {
        const progress = userSnapshot.data()?.progress || {};
        progress["level_1"] = true; // Tandai level 1 selesai
        progress["level_2"] = true; // Unlock level 2
  
        await setDoc(
          userDocRef,
          {
            progress,
          },
          { merge: true } // Jangan hapus data lain
        );
      } else {
        // Jika dokumen belum ada, buat dokumen baru
        await setDoc(
          userDocRef,
          {
            progress: {
              level_1: true,
              level_2: true,
            },
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };
  
  const handleReturnHome = async () => {
    await updateProgress();
    router.push("/homepage");
  };
  
  const handleNextLevel = async () => {
    await updateProgress();
    router.push("/level2");
  };
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/homepage")} style={styles.backButton}>
          <Image source={require("../assets/x.png")} style={styles.backButtonImage} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Question Section */}
      <ScrollView contentContainerStyle={styles.quizContainer}>
        <Text style={styles.title}>Quiz: Introduction to Essay</Text>
        <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
        {questions[currentQuestion].options.map((option, index) => {
          const isCorrect = questions[currentQuestion].correct - 1 === index;
          const isSelected = answers[currentQuestion] === index;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                answers[currentQuestion] !== undefined && isCorrect && styles.correctOption,
                answers[currentQuestion] !== undefined && isSelected && !isCorrect && styles.incorrectOption,
              ]}
              onPress={() => handleOptionClick(index)}
              disabled={answers[currentQuestion] !== undefined}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {currentQuestion > 0 && (
          <TouchableOpacity style={styles.navButton} onPress={() => setCurrentQuestion((prev) => prev - 1)}>
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentQuestion < questions.length - 1 && (
          <TouchableOpacity style={styles.navButton} onPress={() => setCurrentQuestion((prev) => prev + 1)}>
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal */}
      {showModal && (
        <Modal transparent={true} animationType="slide" visible={showModal}>
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <Image source={require("../assets/popup-img.png")} style={styles.popupImage} />
              <Text style={styles.modalTitle}>Congratulations!</Text>
              <Text style={styles.modalText}>You have completed Level 1 Quiz!</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={() => router.push("/homepage")}>
                  <Text style={styles.modalButtonText}>Back to Homepage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleNextLevel}>
                  <Text style={styles.modalButtonText}>Go to Level 2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleRetry}>
                  <Text style={styles.modalButtonText}>Retry Quiz</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Level1Quiz;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFEFF",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
    marginLeft: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#006B49",
  },
  quizContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  correctOption: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
  },
  incorrectOption: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  navButton: {
    padding: 10,
    backgroundColor: "#006B49",
    borderRadius: 5,
  },
  navButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#DE85C7",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    backgroundColor: "#006B49",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});