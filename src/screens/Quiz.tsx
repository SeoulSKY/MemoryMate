import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity, useWindowDimensions,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import {useEffect, useState} from "react";
import {BotProfile, ProfileData} from "../utils/profile";
import Quiz, {MultipleChoiceQuestion} from "../utils/quiz";
import {SafeAreaView} from "react-native-safe-area-context";
import {BorderRadius, Colour, FontFamily, FontSize} from "../constants";
import DiscreteProgressBar from "../components/DiscreteProgressBar";
import NavigationButtons from "../components/NavigationButtons";
import Avatar from "../components/Avatar";
import Animated from "react-native-reanimated";
import {useCarouselAnimation} from "../hooks/animations/carouselAnimation";
import {rootLogger} from "../index";

let selections: number[] = [];

const logger = rootLogger.extend("Quiz");

const defaultRightButtonText = "Next";

export default function (){
  const width = useWindowDimensions().width;

  const [botProfile, setBotProfile] = useState<ProfileData>();
  const [questions, setQuestions] = useState<MultipleChoiceQuestion[]>();
  const [selected, setSelected] = useState<number>();
  const [progress, setProgress] = useState(1);

  const [rightButtonText, setRightButtonText] = useState(defaultRightButtonText);

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const {carouselStyle, playPrevious, playNext} = useCarouselAnimation(width);

  function ChoiceGrid({choices}: {choices: string[]}) {
    const styles = StyleSheet.create({
      container: {
        minHeight: "100%",
        aspectRatio: 1,
      },
      grid: {
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      },
      button: {
        backgroundColor: Colour.secondary,
        borderRadius: BorderRadius.medium,
        justifyContent: "center",
        width: "48%",
        aspectRatio: 1,
        padding: 10,
      },
      text: {
        fontSize: FontSize.medium - 1,
        fontFamily: FontFamily.robotoMedium,
        textAlign: "center",
        color: Colour.black,
      },
      selected: {
        borderWidth: 5,
        borderColor: Colour.primary,
        padding: 5,
      },
    });

    return (
      <Animated.FlatList
        style={[styles.container, carouselStyle]}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.grid}
        data={choices.map((choice, i) => {
          return {index: i, choice: choice};
        })}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={[styles.button, selected === item.index && styles.selected]}
              onPress={() => {
                setSelected(item.index);
                selections[progress - 1] = item.index;
              }}
            >
              <Text
                style={styles.text}
                ellipsizeMode={"tail"}
                numberOfLines={100}
                adjustsFontSizeToFit
              >{item.choice}</Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  }

  useEffect(() => {
    selections = [];

    (async function() {
      setBotProfile(await BotProfile.getInstance().get());
      const quiz = await Quiz.getInstance().getSavedQuiz();
      setQuestions(quiz);
    })().catch(logger.error);
  }, []);

  useEffect(() => {
    if (questions === undefined) {
      return;
    }
    if (progress === questions.length) {
      setRightButtonText("Finish");
      return;
    }

    setRightButtonText(defaultRightButtonText);
  }, [progress, questions]);

  if (questions === undefined) {
    return <View/>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <DiscreteProgressBar progress={progress} total={questions.length} style={styles.progressBar}/>

      <View style={styles.question}>
        <Avatar
          style={styles.avatar}
          imagePath={botProfile!.image!.path}
          name={botProfile!.name}
          text={questions[progress - 1].getQuestion()}
        />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.instruction}>Choose One</Text>
        <ChoiceGrid choices={questions.at(progress - 1)!.getChoices()}/>
        <NavigationButtons
          style={styles.navigationButtons}
          showLeft={progress > 1}
          leftDisabled={progress <= 1}
          rightDisabled={selected === undefined}
          rightText={rightButtonText}
          onLeftPress={() => {
            if (progress > 1) {
              setSelected(selections[progress - 2]);
              setProgress(progress - 1);

              playPrevious();
              return;
            }

            navigation.goBack();
          }}
          onRightPress={async () => {
            if (progress < questions.length) {
              setSelected(selections[progress]);
              setProgress(progress + 1);
              playNext();
              return;
            }

            questions.forEach((question, i) => {
              question.setAnswer(selections[i]);
            });

            await Quiz.getInstance().save(questions);

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
    color: Colour.primary,
    marginBottom: "2%",
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
