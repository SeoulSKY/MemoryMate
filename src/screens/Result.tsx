import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {ParamListBase, useNavigation} from "@react-navigation/native";
import Avatar from "../components/Avatar";
import {useEffect, useState} from "react";
import {BotProfile, ProfileData} from "../utils/profile";
import {SafeAreaView} from "react-native-safe-area-context";
import CircularProgress from "react-native-circular-progress-indicator";
import {BorderRadius, Colour, FontFamily, FontSize} from "../constants";
import Quiz from "../utils/quiz";
import {rootLogger} from "../index";
import {usePulseAnimation} from "../hooks/animations/pulseAnimation";
import Animated from "react-native-reanimated";

const feedbacks = [
  "You're on your way! Keep exploring and learning. Every step forward is progress!",
  "Great job! You're doing well. Keep up the good work and continue to challenge yourself!",
  "Wow! You nailed it! Your hard work and dedication are paying off. Keep shining bright!",
];

const logger = rootLogger.extend("Result");

const minScore = 50;

export default function Result() {
  const [botProfile, setBotProfile] = useState<ProfileData>();
  const [score, setScore] = useState(minScore);
  const [feedback, setFeedback] = useState(feedbacks[0]);
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const {pulseStyle} = usePulseAnimation();

  useEffect(() => {
    (async function () {
      setBotProfile(await BotProfile.getInstance().get());
      const quiz = await Quiz.getInstance().getSavedQuiz();

      const incorrectQuestions = quiz.filter(q => !q.isCorrect());

      if (incorrectQuestions.length !== 0) {
        logger.debug(`Incorrect questions: ${JSON.stringify(incorrectQuestions, null, 2)}`);
      }

      const result = Math.max(minScore, (quiz.length - incorrectQuestions.length) / quiz.length * 100);
      setScore(result);

      if (result <= minScore) {
        setFeedback(feedbacks[0]);
      } else if (result <= 80) {
        setFeedback(feedbacks[1]);
      } else {
        setFeedback(feedbacks[2]);
      }
    })().catch(logger.error);
  }, []);

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
      <Animated.View style={pulseStyle}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Chat")}>
          <Text style={styles.buttonText}>Return to chat</Text>
        </TouchableOpacity>
      </Animated.View>
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
