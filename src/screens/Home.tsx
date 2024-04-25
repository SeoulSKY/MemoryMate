import * as React from "react";
import { Image, ImageBackground } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import {AppName, BorderRadius, Colour, FontFamily, FontSize} from "../constants";
import { UserProfile } from "../utils/profile";
import {useEffect, useState} from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function Home() {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
  const [buttonText, setButtonText] = useState("Let's get started!");

  useEffect(() => {
    UserProfile.getInstance().has().then((hasProfile) => {
      if (hasProfile) {
        setButtonText("Continue");
      }
    });
  },[]);

  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    scale.value = withRepeat(withTiming(1.05, {duration: 500}), -1, true);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../../assets/homeBackground.png")}
        blurRadius={5}
      >

        <View style={styles.dimming} />

        <Image
          style={styles.logo}
          source={require("../../assets/logo.png")}
        />
        <Text style={[styles.appName, styles.text]}>
          {AppName}
        </Text>
        <Text
          style={[styles.bodyText, styles.text]}
        >{`Feeling forgetful? Need a chat buddy?

Chat with our friendly and helpful AI companion designed specifically for those living with dementia. 

Play brain games to keep your mind sharp.`}</Text>
        <Animated.View style={animStyle}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              if (await UserProfile.getInstance().has()) {
                navigation.navigate("ChatPage");
              } else {
                navigation.navigate("SignUp");
              }
            }}
          >
            <Text style={[styles.buttonText, styles.text]}>
              {buttonText}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  dimming: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  text: {
    textAlign: "center",
    color: Colour.white,
  },
  logo: {
    resizeMode: "contain",
    width: "40%",
    aspectRatio: 1,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20%",
    marginBottom: "-5%",
  },
  appName: {
    fontSize: FontSize.extraLarge,
    fontFamily: FontFamily.iBMPlexSansBold,
  },
  bodyText: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.nanumGothicExtraBold,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
    width: "75%",
  },
  button: {
    borderRadius: BorderRadius.small,
    backgroundColor: Colour.main,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
    paddingVertical: 15,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "15%",
  },
  buttonText: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.robotoMedium,
  },
});
