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
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { auth, firestore } from "../config/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const { width: screenWidth } = Dimensions.get("window");

const questions = [
  {
    id: 1,
    question: "What is the main purpose of an expository essay?",
    options: [
      "To express personal opinions on a topic.",
      "To argue for one side of an issue.",
      "To provide a balanced explanation and detailed information about a topic.",
      "To persuade the reader to take action.",
    ],
    correct: 2,
  },
  {
    id: 2,
    question: "Which of the following best describes a thesis statement in an expository essay?",
    options: [
      "It argues one side of a debate.",
      "It expresses personal opinion.",
      "It is objective and uses statements like 'is.'",
      "It suggests what should happen regarding the topic.",
    ],
    correct: 2,
  },
  {
    id: 3,
    question: "Which type of paragraph is not suitable for the body of an expository essay?",
    options: [
      "Description.",
      "Definition.",
      "Problem and solution.",
      "Opinion and personal judgment.",
    ],
    correct: 3,
  },
  {
    id: 4,
    question: "What is included in the introduction of an expository essay?",
    options: [
      "A conclusion and judgment.",
      "An evaluation of the topic.",
      "An explanation of the thesis, topic relevance, and essay structure.",
      "A list of opinions about the topic.",
    ],
    correct: 2,
  },
  {
    id: 5,
    question: "What should be avoided in an expository essay?",
    options: [
      "Providing a balanced, factual explanation.",
      "Using objective language.",
      "Stating opinions or taking a side.",
      "Describing processes.",
    ],
    correct: 2,
  },
];

const progressIncrement = 100 / questions.length;

const Level4Quiz = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number | undefined }>({});
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
        await fetchUserAnswers(user.uid);
      } else {
        Alert.alert("Error", "User not logged in.");
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserAnswers = async (uid: string) => {
    try {
      const quizDocRef = doc(firestore, "quizProgress_level4", uid);
      const quizSnapshot = await getDoc(quizDocRef);

      if (quizSnapshot.exists()) {
        const savedAnswers = quizSnapshot.data()?.answers || {};
        setAnswers(savedAnswers);
        setProgress(Object.keys(savedAnswers).length * progressIncrement);
      }
    } catch (error) {
      console.error("Error fetching user answers:", error);
    }
  };

  const saveUserAnswer = async (questionIndex: number, answerIndex: number) => {
    if (!userId) return;

    try {
      const quizDocRef = doc(firestore, "quizProgress_level4", userId);
      const quizSnapshot = await getDoc(quizDocRef);

      if (quizSnapshot.exists()) {
        const currentAnswers = quizSnapshot.data()?.answers || {};
        currentAnswers[questionIndex] = answerIndex;
        await updateDoc(quizDocRef, { answers: currentAnswers });
      } else {
        await setDoc(quizDocRef, {
          userId: userId,
          answers: { [questionIndex]: answerIndex },
        });
      }

      setAnswers((prev) => ({ ...prev, [questionIndex]: answerIndex }));

      const userDocRef = doc(firestore, "users", userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const currentProgress = userSnapshot.data()?.progress || {};
        currentProgress.level_4 = true;
        currentProgress.level_5 = true;
        await updateDoc(userDocRef, { progress: currentProgress });
      }
    } catch (error) {
      console.error("Error saving user answer:", error);
    }
  };

  const handleOptionClick = (index: number) => {
    saveUserAnswer(currentQuestion, index);

    if (currentQuestion === questions.length - 1) {
      setProgress(100);
    } else {
      setProgress((prev) => prev + progressIncrement);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setProgress(0);
    setAnswers({});
    setShowModal(false);
  };

  const handleFinishQuiz = async () => {
    setShowModal(true);
  };

  const handleReturnHome = () => {
    setShowModal(false);
    router.push("/homepage");
  };

  const handleNextLevel = () => {
    router.push("/level5");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/homepage")} style={styles.backButton}>
          <Image source={require("../assets/x.png")} style={styles.backButtonImage} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.quizContainer}>
        <Text style={styles.title}>Quiz: Expository Essay</Text>
        <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
        {questions[currentQuestion].options.map((option, index: number) => {
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

      <View style={styles.navigation}>
        {currentQuestion > 0 && (
          <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentQuestion < questions.length - 1 ? (
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navButton} onPress={handleFinishQuiz}>
            <Text style={styles.navButtonText}>Finish Quiz</Text>
          </TouchableOpacity>
        )}
      </View>

      {showModal && (
        <Modal transparent={true} animationType="slide" visible={showModal}>
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <Image source={require("../assets/popup-img.png")} style={styles.popupImage} />
              <Text style={styles.modalTitle}>Congratulations!</Text>
              <Text style={styles.modalText}>You have completed Level 4 Quiz!</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleReturnHome}>
                  <Text style={styles.modalButtonText}>Back to Homepage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleNextLevel}>
                  <Text style={styles.modalButtonText}>Next Level</Text>
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

export default Level4Quiz;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.select({ ios: 50, android: 20 }),
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
    paddingHorizontal: 10,
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
    marginHorizontal: 20, 
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