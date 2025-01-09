import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const questions = [
    {
      id: 1,
      question: "What is the main purpose of a persuasive essay?",
      options: [
        "To tell a story",
        "To describe a scene",
        "To convince the reader of a particular viewpoint",
        "To entertain the audience",
      ],
      correct: 3,
    },
    {
      id: 2,
      question: "Which of the following is NOT a key component of a persuasive essay?",
      options: ["Claim", "Evidence", "Character development", "Reasons"],
      correct: 3,
    },
    {
      id: 3,
      question: "Where is the main claim usually presented in a persuasive essay?",
      options: [
        "In the conclusion",
        "In the introduction",
        "In the middle",
        "In the counter-argument",
      ],
      correct: 2,
    },
    {
      id: 4,
      question: "What can be used to support reasons in a persuasive essay?",
      options: [
        "Personal feelings",
        "Artistic expressions",
        "Evidence, like facts or expert opinions",
        "Unrelated anecdotes",
      ],
      correct: 3,
    },
    {
      id: 5,
      question: "What should be avoided in a persuasive essay?",
      options: [
        "'This is a persuasive essay.'",
        "'I like traveling.'",
        "'Are you feeling stressed and overwhelmed?'",
        "'Traveling is good'",
      ],
      correct: 3,
    },
  ]; 

const progressIncrement = 100 / questions.length;

const Level5Quiz = () => {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number | undefined }>({});
  const [showModal, setShowModal] = useState(false);

  const handleOptionClick = (index: number) => {
    const correctAnswer = questions[currentQuestion].correct - 1;
    setAnswers({ ...answers, [currentQuestion]: index });

    if (currentQuestion === questions.length - 1) {
      setProgress(100);
      setShowModal(true);
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

  const handleReturnHome = () => {
    router.push("/homepage");
  };

  const handleNextLevel = () => {
    router.push("/level6");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/level5")} style={styles.backButton}>
          <Image source={require("../assets/x.png")} style={styles.backButtonImage} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Question Section */}
      <ScrollView contentContainerStyle={styles.quizContainer}>
        <Text style={styles.title}>Quiz: Expository Essay</Text>
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
          <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        {currentQuestion < questions.length - 1 && (
          <TouchableOpacity style={styles.navButton} onPress={handleNext}>
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        )}
        {currentQuestion === questions.length - 1 && (
          <TouchableOpacity style={styles.navButton} onPress={() => setShowModal(true)}>
            <Text style={styles.navButtonText}>Finish Quiz</Text>
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
              <Text style={styles.modalText}>You have completed Level 5 Quiz!</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleReturnHome}>
                  <Text style={styles.modalButtonText}>Back to Homepage</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleNextLevel}>
                  <Text style={styles.modalButtonText}>Go to Level 6</Text>
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

export default Level5Quiz;

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
