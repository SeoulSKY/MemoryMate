import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity, FlatList,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import {useEffect, useState} from "react";
import {Gender, ProfileData} from "../utils/profile";
import Quiz, {Difficulty, MultipleChoiceQuestion} from "../utils/quiz";
import {SafeAreaView} from "react-native-safe-area-context";
import {BorderRadius, Colour, FontFamily, FontSize} from "../constants";
import DiscreteProgressBar from "../components/DiscreteProgressBar";
import NavigationButtons from "../components/NavigationButtons";
import Avatar from "../components/Avatar";

let selections: number[] = [];

const defaultRightButtonText = "Next";

export default function (){
  const [botProfile, setBotProfile] = useState<ProfileData>();
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>();
  const [numQuestions, setNumQuestions] = useState(0);
  const [selected, setSelected] = useState<number | undefined>();
  const [progress, setProgress] = useState(1);

  const [rightButtonText, setRightButtonText] = useState(defaultRightButtonText);

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  useEffect(() => {
    selections = [];

    // BotProfile.getInstance().get().then(setBotProfile).catch(console.error);
    // Quiz.getInstance().getSavedQuiz().then(questions => {
    //   setQuestions(questions);
    //   setNumQuestions(questions.length);
    // }).catch(console.error);

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
    if (progress === numQuestions) {
      setRightButtonText("Finish");
      return;
    }

    setRightButtonText(defaultRightButtonText);
  }, [progress]);

  useEffect(() => {
    if (questions === undefined) {
      return;
    }
    setNumQuestions(questions.length);
  }, [questions]);

  return (
    <SafeAreaView style={styles.container}>
      <DiscreteProgressBar progress={progress} total={numQuestions} style={styles.progressBar}/>

      {questions && <View style={styles.question}>
        {botProfile && <Avatar
          style={styles.avatar}
          imagePath={botProfile.image!.path}
          name={botProfile.name}
          text={questions.at(progress - 1)?.getQuestion()}
        />}
      </View>}

      <View style={styles.bottomContainer}>
        <Text style={styles.instruction}>Choose One</Text>
        {questions && <FlatList
          style={styles.grid}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.choiceGridContainer}
          columnWrapperStyle={styles.choiceGridContainer}
          data={questions.at(progress - 1)!.getChoices().map((choice, i) => {
            return {index: i, choice: choice};
          })}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={[styles.choiceButton, selected === item.index && styles.selected]}
                onPress={() => {
                  setSelected(item.index);
                  selections[progress - 1] = item.index;
                }}
              >
                <Text style={styles.choiceText}>{item.choice}</Text>
              </TouchableOpacity>
            );
          }}
        />}
        <NavigationButtons
          style={styles.navigationButtons}
          leftDisabled={progress <= 1}
          rightDisabled={selected === undefined}
          rightText={rightButtonText}
          onLeftPress={() => {
            if (progress > 1) {
              setSelected(selections[progress - 2]);
              setProgress(progress - 1);

              return;
            }

            navigation.goBack();
          }}
          onRightPress={async () => {
            if (progress < numQuestions) {
              setSelected(selections[progress]);
              setProgress(progress + 1);
              return;
            }

            questions?.forEach((question, i) => {
              question.setAnswer(selections[i]);
            });
            await Quiz.getInstance().save(questions!);

            navigation.navigate("Result");
          }}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    minWidth: "100%",
  },
  instruction: {
    textAlign: "center",
    fontSize: FontSize.medium,
    fontFamily: FontFamily.robotoMedium,
    color: Colour.main,
    marginBottom: "2%",
  },
  grid: {
    minHeight: "100%",
    aspectRatio: 1,
  },
  choiceGridContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  choiceButton: {
    backgroundColor: Colour.skyBlue,
    borderRadius: BorderRadius.medium,
    justifyContent: "center",
    width: "48%",
    aspectRatio: 1,
  },
  choiceText: {
    fontSize: FontSize.medium - 1,
    fontFamily: FontFamily.robotoMedium,
    textAlign: "center",
    color: Colour.black,
  },
  selected: {
    borderWidth: 5,
    borderColor: Colour.main,
  },
  navigationButtons: {
    marginTop: "5%",
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "5%",
  }
});
