import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {ParamListBase, useNavigation} from "@react-navigation/native";
import Avatar from "../components/Avatar";
import {useEffect, useState} from "react";
import {Gender, ProfileData} from "../utils/profile";
import {SafeAreaView} from "react-native-safe-area-context";
import CircularProgress from "react-native-circular-progress-indicator";
import {BorderRadius, Colour, FontFamily, FontSize} from "../constants";
import {Difficulty, MultipleChoiceQuestion} from "../utils/quiz";

const feedbacks = [
  "You're on your way! Keep exploring and learning. Every step forward is progress!",
  "Great job! You're doing well. Keep up the good work and continue to challenge yourself!",
  "Wow! You nailed it! Your hard work and dedication are paying off. Keep shining bright!",
];

const minScore = 50;

export default function Result() {
  const [botProfile, setBotProfile] = useState<ProfileData | undefined>();
  const [score, setScore] = useState(minScore);
  const [feedback, setFeedback] = useState(feedbacks[0]);
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[] | undefined>();
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useEffect(() => {
    // BotProfile.getInstance().get().then(setBotProfile).catch(console.error);
    // Quiz.getInstance().getSavedQuiz().then(setQuestions).catch(console.error);

    // mock data
    setBotProfile({
      name: "Ben",
      image: {
        path: require("../../assets/profiles/male/40_0.png"),
        width: 256,
        height: 256,
        mimeType: "image/png",
      },
      age: 0,
      gender: Gender.MALE,
    });

    setQuestions([
      new MultipleChoiceQuestion(
        "So, I went to the market today. It was crowded. Where did you go yesterday?",
        Difficulty.EASY,
        ["Library", "Mary's House", "Stayed at Home", "Swimming Pool"],
        1,
      ).setAnswer(1),
      new MultipleChoiceQuestion(
        "What is the capital of France?",
        Difficulty.NORMAL,
        ["Paris", "London", "Berlin", "Madrid"],
        0,
      ).setAnswer(0),
      new MultipleChoiceQuestion(
        "What is the capital of Spain?",
        Difficulty.NORMAL,
        ["Paris", "London", "Berlin", "Madrid"],
        3,
      ).setAnswer(3),
      new MultipleChoiceQuestion(
        "What is the capital of Germany?",
        Difficulty.NORMAL,
        ["Paris", "London", "Berlin", "Madrid"],
        2,
      ).setAnswer(2),
      new MultipleChoiceQuestion(
        "What is the capital of England?",
        Difficulty.NORMAL,
        ["Paris", "London", "Berlin", "Madrid"],
        1,
      ).setAnswer(1),
    ]);
  }, []);

  useEffect(() => {
    if (questions === undefined) {
      return;
    }

    const result = Math.max(minScore, questions.filter(q => q.isCorrect()).length / questions.length * 100);
    setScore(result);

    if (result <= minScore) {
      setFeedback(feedbacks[0]);
    } else if (result <= 80) {
      setFeedback(feedbacks[1]);
    } else {
      setFeedback(feedbacks[2]);
    }
  }, [questions]);

  return (
    <SafeAreaView style={styles.container}>
      {botProfile && <Avatar
        style={styles.avatar}
        imagePath={botProfile.image!.path}
        name={botProfile.name}
        text={feedback}
      />}
      <View style={styles.scoreBar}>
        <CircularProgress
          value={score}
          radius={100}
          valueSuffix={"%"}
          progressValueColor={Colour.gray}
          activeStrokeColor={Colour.primary}
          inActiveStrokeColor={Colour.lightGray}
          inActiveStrokeWidth={20}
          activeStrokeWidth={30}
          progressValueStyle={styles.scoreValue}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ChatPage")}>
        <Text style={styles.buttonText}>Return to chat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    maxWidth: "95%",
    alignSelf: "center",
  },
  avatar: {
    marginHorizontal: "3%",
    marginVertical: "10%",
    minWidth: "100%",
  },
  scoreBar: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  scoreValue: {
    fontFamily: FontFamily.nunitoBlack,
    fontSize: FontSize.large + 5,
  },
  button: {
    backgroundColor: Colour.primary,
    borderRadius: BorderRadius.small,
    marginTop: "auto",
    marginBottom: "10%",
  },
  buttonText: {
    color: Colour.white,
    paddingHorizontal: "7%",
    paddingVertical: "3%",
    fontSize: FontSize.medium,
    fontFamily: FontFamily.robotoMedium,
  },
});
