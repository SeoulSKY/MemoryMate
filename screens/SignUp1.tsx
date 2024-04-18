import * as React from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { Border, FontFamily, Padding, FontSize, Color } from "../GlobalStyles";

const SignUp1 = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.signUp2}>
      <View style={styles.statusBarWrapper}>
        <View style={styles.statusBarWrapper}>
          <Image
            style={styles.excludeIcon}
            contentFit="cover"
            source={require("../assets/exclude2.png")}
          />
          <Image
            style={styles.excludeIcon1}
            contentFit="cover"
            source={require("../assets/exclude6.png")}
          />
          <View style={[styles.group, styles.groupPosition]}>
            <Image
              style={styles.vectorIcon}
              contentFit="cover"
              source={require("../assets/vector1.png")}
            />
            <View style={styles.rectangle} />
            <View style={styles.rectangle1} />
          </View>
          <View style={[styles.frame, styles.groupPosition]}>
            <Text style={styles.text}>9:41</Text>
          </View>
        </View>
      </View>
      <View style={[styles.progressBarWrapper, styles.namelblFlexBox]}>
        <View style={styles.progressBar}>
          <View style={styles.stBar} />
          <View style={[styles.ndBar, styles.barLayout]} />
          <View style={[styles.rdBar, styles.barLayout]} />
        </View>
      </View>
      <View style={[styles.about, styles.aboutPosition]}>
        <Text style={styles.iWantTo}>{`I want to get to
know about you`}</Text>
      </View>
      <View style={[styles.titlename, styles.aboutPosition]}>
        <Text style={[styles.whatIsYour, styles.yourTypo]}>
          What is your age?
        </Text>
      </View>
      <View style={styles.nameinput}>
        <View style={[styles.namelbl, styles.namelblFlexBox]}>
          <Text style={[styles.writeYourName, styles.yourTypo]}>
            Select your age
          </Text>
        </View>
        <Image
          style={styles.namelineIcon}
          contentFit="cover"
          source={require("../assets/nameline.png")}
        />
      </View>
      <TouchableOpacity
        style={[styles.backbtn, styles.backbtnPosition]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("SignUp2")}
      >
        <Text style={[styles.back, styles.backTypo]}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.nextbtn, styles.backbtnPosition]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={[styles.next, styles.backTypo]}>Next</Text>
      </TouchableOpacity>
      <Pressable style={[styles.microphone, styles.namelblFlexBox]}>
        <Image
          style={styles.vectorIcon1}
          contentFit="cover"
          source={require("../assets/vector4.png")}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  groupPosition: {
    bottom: "36.36%",
    position: "absolute",
  },
  namelblFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  barLayout: {
    marginLeft: 8,
    height: 10,
    borderRadius: Border.br_5xs,
    flex: 1,
  },
  aboutPosition: {
    right: 49,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  yourTypo: {
    lineHeight: 14,
    fontFamily: FontFamily.gothicA1Bold,
    fontWeight: "700",
    letterSpacing: 0,
  },
  backbtnPosition: {
    paddingVertical: Padding.p_mini,
    height: 41,
    borderRadius: Border.br_mini,
    top: 735,
    left: "50%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  backTypo: {
    lineHeight: 16,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.gothicA1Bold,
    fontWeight: "700",
    textAlign: "center",
  },
  excludeIcon: {
    width: 17,
    height: 11,
  },
  excludeIcon1: {
    width: 15,
    height: 11,
  },
  vectorIcon: {
    height: "36.36%",
    width: "5.26%",
    top: "36.36%",
    right: "0.4%",
    bottom: "27.27%",
    left: "94.33%",
    maxWidth: "100%",
    maxHeight: "100%",
    opacity: 0.4,
    position: "absolute",
    overflow: "hidden",
  },
  rectangle: {
    height: "100%",
    width: "89.07%",
    top: "0%",
    right: "10.93%",
    bottom: "0%",
    borderRadius: 3,
    borderStyle: "solid",
    borderColor: Color.colorBlack,
    borderWidth: 1,
    opacity: 0.35,
    left: "0%",
    position: "absolute",
  },
  rectangle1: {
    height: "63.64%",
    width: "72.87%",
    top: "18.18%",
    right: "19.03%",
    bottom: "18.18%",
    left: "8.1%",
    borderRadius: 1,
    backgroundColor: Color.colorBlack,
    position: "absolute",
  },
  group: {
    height: "25%",
    width: "6.59%",
    top: "38.64%",
    right: "6.48%",
    left: "86.93%",
  },
  text: {
    marginTop: -4.5,
    top: "50%",
    fontSize: FontSize.size_mini,
    lineHeight: 20,
    fontWeight: "500",
    fontFamily: FontFamily.robotoMedium,
    textAlign: "center",
    color: Color.colorBlack,
    letterSpacing: 0,
    left: "0%",
    position: "absolute",
    width: "100%",
  },
  frame: {
    height: "47.73%",
    width: "14.4%",
    top: "15.91%",
    right: "80%",
    left: "5.6%",
  },
  statusBarWrapper: {
    top: 0,
    left: 0,
    width: 375,
    height: 44,
    position: "absolute",
  },
  stBar: {
    height: 10,
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorMediumpurple,
    flex: 1,
  },
  ndBar: {
    backgroundColor: Color.colorMediumpurple,
  },
  rdBar: {
    backgroundColor: Color.colorGray_100,
  },
  progressBar: {
    width: 260,
    alignItems: "center",
    flexDirection: "row",
  },
  progressBarWrapper: {
    top: 59,
    width: 277,
    height: 34,
    padding: Padding.p_3xs,
    left: 49,
    position: "absolute",
  },
  iWantTo: {
    fontSize: FontSize.size_13xl,
    lineHeight: 18,
    fontFamily: FontFamily.gothicA1Bold,
    fontWeight: "700",
    textAlign: "center",
    color: Color.colorBlack,
  },
  about: {
    top: 168,
    height: 67,
    left: 49,
  },
  whatIsYour: {
    fontSize: FontSize.size_xl,
    color: Color.colorMediumpurple,
    textAlign: "center",
  },
  titlename: {
    top: 316,
    left: 48,
    height: 45,
    padding: Padding.p_3xs,
  },
  writeYourName: {
    fontSize: FontSize.size_sm,
    textAlign: "left",
    color: Color.colorGray_100,
  },
  namelbl: {
    padding: Padding.p_3xs,
  },
  namelineIcon: {
    width: 278,
    height: 1,
    marginTop: 1,
  },
  nameinput: {
    marginLeft: -137.5,
    top: 436,
    left: "50%",
    position: "absolute",
  },
  back: {
    color: Color.colorGray_100,
  },
  backbtn: {
    marginLeft: -138.5,
    backgroundColor: Color.colorWhitesmoke,
    width: 128,
    paddingHorizontal: Padding.p_21xl,
  },
  next: {
    color: Color.colorWhite,
  },
  nextbtn: {
    marginLeft: 9.5,
    width: 129,
    paddingHorizontal: Padding.p_16xl,
    backgroundColor: Color.colorMediumpurple,
  },
  vectorIcon1: {
    width: 43,
    height: 62,
  },
  microphone: {
    top: 570,
    right: 147,
    bottom: 160,
    left: 147,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorLightgray,
    paddingHorizontal: Padding.p_6xl,
    paddingVertical: Padding.p_xl,
    position: "absolute",
    overflow: "hidden",
  },
  signUp2: {
    backgroundColor: Color.colorWhite,
    height: 812,
    overflow: "hidden",
    width: "100%",
    flex: 1,
  },
});

export default SignUp1;
