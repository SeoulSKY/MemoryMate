import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList, TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import {useEffect, useState} from "react";
import {BotProfile, Gender, ProfileData} from "../utils/profile";
import Quiz, {Difficulty, MultipleChoiceQuestion} from "../utils/quiz";
import {SafeAreaView} from "react-native-safe-area-context";
import {BorderRadius, Colour, FontFamily, FontSize} from "../constants";
import DiscreteProgressBar from "../components/DiscreteProgressBar";
import NavigationButtons from "../components/NavigationButtons";
import Avatar from "../components/Avatar";

export default function (){
  const [botProfile, setBotProfile] = useState<ProfileData>();
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>();
  const [numQuestions, setNumQuestions] = useState(10);
  const [progress, setProgress] = useState(1);

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useEffect(() => {
    // BotProfile.getInstance().get().then(setBotProfile).catch(console.error);
    // Quiz.getInstance().getSavedQuiz().then(questions => {
    //   setQuestions(questions);
    //   setNumQuestions(questions.length);
    // }).catch(console.error);

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
        ["Library", "Mary's House", "Stayed at home", "Swimming Pool"],
        1,
      ),
      new MultipleChoiceQuestion(
        "What is the capital of France?",
        Difficulty.NORMAL,
        ["Paris", "London", "Berlin", "Madrid"],
        0,
      ),
      new MultipleChoiceQuestion(
        "What is the capital of Spain?",
        Difficulty.NORMAL,
        ["Paris", "London", "Berlin", "Madrid"],
        3,
      ),
      new MultipleChoiceQuestion(
        "What is the capital of Germany?",
        Difficulty.NORMAL,
        ["Paris", "London", "Berlin", "Madrid"],
        2,
      ),
      new MultipleChoiceQuestion(
        "What is the capital of England?",
        Difficulty.NORMAL,
        ["Paris", "London", "Berlin", "Madrid"],
        1,
      ),
    ]);
    }, []);

  useEffect(() => {
    if (questions === undefined) {
      return;
    }
    setNumQuestions(questions.length);
  }, [questions])

  return (
    <SafeAreaView style={styles.container}>
      <DiscreteProgressBar progress={progress} total={numQuestions} style={styles.progressBar}/>

      {questions && <View style={styles.question}>
        {botProfile && <Avatar
          style={styles.avatar}
          imagePath={botProfile.image?.path!}
          name={botProfile.name}
          text={questions.at(progress - 1)?.getQuestion()}
        />}
        <Text style={styles.instruction}>Choose One</Text>
        <FlatList contentContainerStyle={styles.choiceContainer}
          numColumns={2}
          data={questions.at(progress - 1)?.getChoices().map((choice, i) => {
            return {id: i, title: choice};
          })}
          renderItem={({item}) => {
            return (
              <TouchableOpacity style={styles.choiceButton}>
                <Text style={styles.choiceText}>{item.title}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>}
      <NavigationButtons style={styles.navigationButtons} onLeftPress={() => {}} onRightPress={() => {}}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "95%",
    alignSelf: "center",
  },
  progressBar: {
    marginTop: "5%",
    width: "90%",
  },
  question: {
    flex: 1,
    marginVertical: "10%",
  },
  avatar: {
    marginHorizontal: "3%",
    marginBottom: "10%",
  },
  instruction: {
    textAlign: "center",
    fontSize: FontSize.medium,
    fontFamily: FontFamily.robotoMedium,
    color: Colour.main,
    marginBottom: "2%",
  },
  choiceContainer: {
    alignItems: "center",
  },
  choiceButton: {
    backgroundColor: Colour.skyBlue,
    borderRadius: BorderRadius.medium,
    justifyContent: "center",
    alignItems: "center",
    margin: "2%",
    width: "45%",
    aspectRatio: 1,
  },
  choiceText: {
    fontSize: FontSize.medium - 1,
    fontFamily: FontFamily.robotoMedium,
    textAlign: "center",
    color: Colour.black,
    padding: "5%",
  },
  navigationButtons: {
    marginBottom: "5%",
  }
});
