import * as React from "react";
import {useEffect, useState} from "react";
import {Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, useWindowDimensions} from "react-native";
import {StackNavigationProp} from "@react-navigation/stack";
import {ParamListBase, useNavigation} from "@react-navigation/native";
import {BorderRadius, Colour, FontFamily, FontSize} from "../constants";
import DiscreteProgressBar from "../components/DiscreteProgressBar";
import {SafeAreaView} from "react-native-safe-area-context";
import {SelectList} from "react-native-dropdown-select-list/index";
import {BotProfile, Gender, UserProfile} from "../utils/profile";
import {InvalidStateError} from "../utils/errors";
import NavigationButtons from "../components/NavigationButtons";
import Animated from "react-native-reanimated";
import {useCarouselAnimation} from "../hooks/animations/carouselAnimation";
import {useShakeAnimation} from "../hooks/animations/shakeAnimation";

const botNames = {
  [Gender.MALE]: ["Ben", "Charlie", "David", "Ethan", "Frank", "George", "Harry", "Ian", "Jack", "Kevin"],
  [Gender.FEMALE]: ["Alice", "Bella", "Catherine", "Daisy", "Emily", "Fiona", "Grace", "Hannah", "Isabella", "Jasmine"],
  [Gender.NON_BINARY]: ["Alex", "Bailey", "Charlie", "Dakota", "Eli", "Finley", "Gray", "Harper", "Indigo", "Jordan"]
};

const numInputs = 3;

const defaultRightButtonText = "Next";

const genderList = [
  {key: Gender.MALE, value: "Male"},
  {key: Gender.FEMALE, value: "Female"},
  {key: Gender.NON_BINARY, value: "Non-binary"},
];

const ageDifferenceRange = 3;
const minBotAge = 40;

function isNameValid(name: string): boolean {
  return name.trim().length > 0;
}

function isAgeValid(age: number): boolean {
  return !isNaN(age) && Number.isInteger(age) && 0 <= age && age <= 150;
}

function randomNumberInRange(num: number, range: number) {
  const min = num - range;
  const max = num + range;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function SignUp() {
  const width = useWindowDimensions().width;

  const [progress, setProgress] = useState(1);
  const [rightButtonText, setRightButtonText] = useState(defaultRightButtonText);
  const [rightButtonDisabled, setRightButtonDisabled] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | undefined>();
  const [gender, setGender] = useState<Gender | undefined>();

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const {carouselStyle, playPrevious, playNext} = useCarouselAnimation(width);
  const {shakeStyle, playShake} = useShakeAnimation();

  useEffect(() => {
    if (progress === numInputs) {
      setRightButtonText("Finish");
    } else {
      setRightButtonText(defaultRightButtonText);
    }

    switch (progress) {
    case 1:
      setRightButtonDisabled(!isNameValid(name));
      break;
    case 2:
      setRightButtonDisabled(age === undefined || !isAgeValid(age));
      break;
    case 3:
      setRightButtonDisabled(gender === undefined);
      break;
    default:
      throw new InvalidStateError(`Invalid progress value: ${progress}`);
    }
  }, [progress]);

  return (
    <SafeAreaView style={styles.container} onStartShouldSetResponder={() => {
      Keyboard.dismiss();
      return false;
    }}>
      <DiscreteProgressBar progress={progress} total={numInputs} style={styles.progressBar}/>
      <Text style={styles.title}>{"I want to get to know about you"}</Text>
      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={"position"}
        keyboardVerticalOffset={-150}
      >
        {progress === 1 &&
          <Animated.View style={[styles.inputContainer, carouselStyle, shakeStyle]}>
            <Text style={styles.inputLabel}>{"What is your name?"}</Text>
            <TextInput
              style={styles.input}
              placeholder={"Press here to write your name"}
              maxLength={40}
              textAlign={"center"}
              value={name}
              onChangeText={text => {
                setName(text);

                if (!isNameValid(text)) {
                  setError("Your name cannot be empty");
                  setRightButtonDisabled(true);
                  playShake();
                  return;
                }

                setError("");
                setRightButtonDisabled(false);
              }}
            />
            <Text style={styles.errorLabel}>{error}</Text>
          </Animated.View>
        }

        {progress === 2 &&
          <Animated.View style={[styles.inputContainer, carouselStyle, shakeStyle]}>
            <Text style={styles.inputLabel}>{"How old are you?"}</Text>
            <TextInput
              style={[styles.input, styles.ageInput]}
              placeholder={"Press here to write your age"}
              keyboardType={"numeric"}
              textAlign={"center"}
              maxLength={3}
              value={age === undefined ? "" : age.toString()}
              onChangeText={text => {
                const num = parseInt(text);
                setAge(isNaN(num) ? undefined : num);

                if (!isAgeValid(num)) {
                  setError("Please enter a valid age");
                  setRightButtonDisabled(true);
                  playShake();
                  return;
                }

                setError("");
                setRightButtonDisabled(false);
              }}/>
            <Text style={styles.errorLabel}>{error}</Text>
          </Animated.View>
        }
        {progress === 3 &&
          <Animated.View style={[styles.inputContainer, carouselStyle, shakeStyle]}>
            <Text style={styles.inputLabel}>{"What is your gender?"}</Text>
            <SelectList
              placeholder={"Press here to select your gender"}
              search={false}
              data={genderList}
              maxHeight={130}
              inputStyles={styles.genderPlaceholder}
              dropdownTextStyles={styles.genderText}
              boxStyles={styles.genderSelect}
              dropdownStyles={{...styles.genderSelect}}
              defaultOption={gender === undefined ? undefined : genderList.find(g => g.key)}
              setSelected={setGender}
              onSelect={() => {
                setRightButtonDisabled(false);
              }}
            />
            <Text style={styles.errorLabel}>{error}</Text>
          </Animated.View>
        }
      </KeyboardAvoidingView>

      <NavigationButtons
        style={styles.navigationButtons}
        rightDisabled={rightButtonDisabled}
        rightText={rightButtonText}
        onLeftPress={() => {
          if (progress > 1) {
            setProgress(progress - 1);

            playPrevious();
            return;
          }

          navigation.goBack();
        }}
        onRightPress={async () => {
          if (progress < numInputs) {
            setProgress(progress + 1);

            playNext();
            return;
          }

          const names = botNames[gender!];
          const randomIndex = Math.floor(Math.random() * names.length);

          await UserProfile.getInstance().create({name, age: age!, gender: gender!});
          await BotProfile.getInstance().create({
            name: names[randomIndex],
            age: Math.max(minBotAge, randomNumberInRange(age!, ageDifferenceRange)),
            gender: gender!,
          });

          navigation.navigate("Chat");
        }}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  progressBar: {
    marginTop: "5%",
    width: "90%",
  },
  title: {
    fontSize: FontSize.large,
    fontFamily: FontFamily.gothicA1Bold,
    textAlign: "center",
    color: Colour.black,
    marginTop: "30%",
  },
  errorLabel: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.gothicA1Bold,
    color: Colour.error,
    marginTop: "2%",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
  },
  inputLabel: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.gothicA1Bold,
    color: Colour.primary,
    marginBottom: "2%",
  },
  input: {
    borderWidth: 3,
    borderColor: Colour.primary,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: "5%",
    paddingVertical: "4%",
    fontSize: FontSize.small,
    minWidth: "80%",
  },
  ageInput: {
    minWidth: "60%",
  },
  genderSelect: {
    borderWidth: 3,
    borderColor: Colour.primary,
    borderRadius: BorderRadius.medium,
    minWidth: "50%",
  },
  genderPlaceholder: {
    color: Colour.gray,
    fontSize: FontSize.small,
    fontFamily: FontFamily.robotoMedium,
  },
  genderText: {
    color: Colour.black,
    fontSize: FontSize.small,
    fontFamily: FontFamily.robotoMedium,
  },
  navigationButtons: {
    marginBottom: "5%",
  }
});
