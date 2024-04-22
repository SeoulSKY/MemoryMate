import * as React from "react";
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { Padding, Color, Border, FontFamily, FontSize } from "../../GlobalStyles";

const SignUp = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.signUp3}>
      <View style={styles.statusBarWrapper}>
        <View style={styles.statusBarWrapper}>
          <View style={styles.frame}>
            <Text style={styles.text}>9:41</Text>
          </View>
          <Image
            style={styles.excludeIcon}
            contentFit="cover"
            source={require("../assets/exclude4.png")}
          />
          <Image
            style={styles.excludeIcon1}
            contentFit="cover"
            source={require("../assets/exclude5.png")}
          />
          <View style={styles.group}>
            <Image
              style={styles.vectorIcon}
              contentFit="cover"
              source={require("../assets/vector3.png")}
            />
            <View style={styles.rectangle} />
            <View style={styles.rectangle1} />
          </View>
        </View>
      </View>
      <View style={[styles.progressBarWrapper, styles.wrapperFlexBox]}>
        <View style={styles.progressBar}>
          <View style={styles.barLayout} />
          <View style={[styles.ndBar, styles.barLayout]} />
          <View style={[styles.ndBar, styles.barLayout]} />
        </View>
      </View>
      <View style={[styles.about, styles.aboutFlexBox]} />
      <View
        style={[
          styles.iWantToGetToKnowAboutYoWrapper,
          styles.nameinputPosition,
        ]}
      >
        <Text style={styles.iWantTo}>{`I want to get to
know about you`}</Text>
      </View>
      <View style={[styles.titlename, styles.wrapperFlexBox]}>
        <Text style={[styles.whatIsYour, styles.yourTypo]}>
          What is your gender?
        </Text>
      </View>
      <View style={[styles.nameinput, styles.nameinputPosition]}>
        <View style={[styles.namelbl, styles.wrapperFlexBox]}>
          <Text style={[styles.writeYourName, styles.yourTypo]}>
            What is your gender?
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
        onPress={() => navigation.navigate("SignUp1")}
      >
        <Text style={[styles.back, styles.backTypo]}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.nextbtn, styles.backbtnPosition]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("ChatPage")}
      >
        <Text style={[styles.next, styles.backTypo]}>Done</Text>
      </TouchableOpacity>
      <View style={[styles.microphone, styles.aboutFlexBox]}>
        <Image
          style={styles.vectorIcon1}
          contentFit="cover"
          source={require("../assets/vector4.png")}
        />
      </View>
      <Pressable style={styles.btnmale}>
        <Text style={[styles.back, styles.backTypo]}>Male</Text>
      </Pressable>
      <Pressable style={[styles.btnfemal, styles.btnfemalPosition]}>
        <Text style={[styles.back, styles.backTypo]}>Female</Text>
      </Pressable>
      <Pressable style={[styles.btnnonbinary, styles.btnfemalPosition]}>
        <Text style={[styles.back, styles.backTypo]}>Non-binary</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperFlexBox: {
    padding: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
  },
  barLayout: {
    height: 10,
    backgroundColor: Color.colorMediumpurple,
    borderRadius: Border.br_5xs,
    flex: 1,
  },
  aboutFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  nameinputPosition: {
    left: 50,
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
    left: "50%",
    top: 735,
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
  btnfemalPosition: {
    backgroundColor: Color.colorAliceblue,
    height: 52,
    left: 94,
    right: 109,
    borderRadius: Border.br_mini,
    padding: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  text: {
    marginTop: -4.5,
    fontSize: FontSize.size_mini,
    lineHeight: 20,
    fontWeight: "500",
    fontFamily: FontFamily.robotoMedium,
    textAlign: "center",
    color: Color.colorBlack,
    letterSpacing: 0,
    left: "0%",
    top: "50%",
    position: "absolute",
    width: "100%",
  },
  frame: {
    top: 7,
    left: 21,
    width: 54,
    height: 21,
    position: "absolute",
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
    height: "31.43%",
    width: "6.64%",
    top: "48.57%",
    right: "5.65%",
    bottom: "20%",
    left: "87.72%",
    position: "absolute",
  },
  statusBarWrapper: {
    top: 0,
    left: 0,
    width: 372,
    height: 35,
    position: "absolute",
  },
  ndBar: {
    marginLeft: 8,
  },
  progressBar: {
    width: 260,
    alignItems: "center",
    flexDirection: "row",
  },
  progressBarWrapper: {
    top: 59,
    flexDirection: "row",
    height: 34,
    padding: Padding.p_3xs,
    left: 49,
    right: 49,
    position: "absolute",
  },
  about: {
    top: 168,
    height: 67,
    left: 49,
    right: 49,
  },
  iWantTo: {
    fontSize: FontSize.size_13xl,
    lineHeight: 18,
    fontFamily: FontFamily.gothicA1Bold,
    fontWeight: "700",
    textAlign: "center",
    color: Color.colorBlack,
  },
  iWantToGetToKnowAboutYoWrapper: {
    top: 126,
    right: 48,
    padding: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  whatIsYour: {
    fontSize: FontSize.size_xl,
    color: Color.colorMediumpurple,
    textAlign: "center",
  },
  titlename: {
    top: 268,
    left: 48,
    height: 45,
    right: 49,
    padding: Padding.p_3xs,
    position: "absolute",
  },
  writeYourName: {
    fontSize: FontSize.size_sm,
    textAlign: "left",
    display: "none",
    color: Color.colorGray_100,
  },
  namelbl: {
    width: 131,
    flexDirection: "row",
    height: 34,
    padding: Padding.p_3xs,
  },
  namelineIcon: {
    width: 278,
    height: 1,
    marginTop: 1,
    display: "none",
  },
  nameinput: {
    top: 436,
  },
  back: {
    color: Color.colorGray_100,
  },
  backbtn: {
    marginLeft: -138.5,
    width: 128,
    paddingHorizontal: Padding.p_21xl,
    backgroundColor: Color.colorWhitesmoke,
    paddingVertical: Padding.p_mini,
    height: 41,
    borderRadius: Border.br_mini,
    left: "50%",
    top: 735,
  },
  next: {
    color: Color.colorWhite,
  },
  nextbtn: {
    marginLeft: 9.5,
    width: 129,
    paddingHorizontal: Padding.p_16xl,
    paddingVertical: Padding.p_mini,
    height: 41,
    borderRadius: Border.br_mini,
    left: "50%",
    top: 735,
    backgroundColor: Color.colorMediumpurple,
  },
  vectorIcon1: {
    width: 43,
    height: 62,
  },
  microphone: {
    marginTop: 164,
    width: "21.6%",
    right: "39.2%",
    left: "39.2%",
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorLightgray,
    height: 82,
    paddingHorizontal: Padding.p_6xl,
    paddingVertical: Padding.p_xl,
    display: "none",
    flexDirection: "row",
    top: "50%",
    justifyContent: "center",
    overflow: "hidden",
  },
  btnmale: {
    top: 395,
    height: 52,
    left: 94,
    right: 109,
    backgroundColor: Color.colorWhitesmoke,
    borderRadius: Border.br_mini,
    padding: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  btnfemal: {
    top: 497,
  },
  btnnonbinary: {
    top: 599,
  },
  signUp3: {
    backgroundColor: Color.colorWhite,
    height: 812,
    overflow: "hidden",
    width: "100%",
    flex: 1,
  },
});

export default SignUp;
