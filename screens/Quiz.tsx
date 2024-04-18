import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { Color, Padding, Border, FontFamily, FontSize } from "../GlobalStyles";

const Quiz = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.quiz}>
      <View style={[styles.quizChild, styles.quizChildPosition]} />
      <View style={[styles.statusBarWrapper, styles.quizChildPosition]}>
        <View style={[styles.statusBarWrapper, styles.quizChildPosition]}>
          <Image
            style={styles.excludeIcon}
            contentFit="cover"
            source={require("../assets/exclude2.png")}
          />
          <Image
            style={styles.excludeIcon1}
            contentFit="cover"
            source={require("../assets/exclude3.png")}
          />
          <View style={[styles.group, styles.groupPosition]}>
            <Image
              style={styles.vectorIcon}
              contentFit="cover"
              source={require("../assets/vector1.png")}
            />
            <View style={[styles.rectangle, styles.textPosition]} />
            <View style={styles.rectangle1} />
          </View>
          <View style={[styles.frame, styles.groupPosition]}>
            <Text style={[styles.text, styles.textFlexBox]}>9:41</Text>
          </View>
        </View>
      </View>
      <Pressable style={[styles.option1, styles.optionLayout]}>
        <Text style={[styles.library, styles.libraryTypo]}>Library</Text>
      </Pressable>
      <Pressable style={[styles.option3, styles.optionPosition]}>
        <Text style={[styles.library, styles.libraryTypo]}>Stayed at home</Text>
      </Pressable>
      <Pressable style={[styles.option4, styles.optionPosition]}>
        <Text style={[styles.library, styles.libraryTypo]}>Swimming Pool</Text>
      </Pressable>
      <Pressable style={[styles.option2, styles.optionLayout]}>
        <Text style={[styles.library, styles.libraryTypo]}>Mary’s House</Text>
      </Pressable>
      <TouchableOpacity
        style={[styles.btnnxt, styles.btnnxtLayout]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("Results")}
      >
        <Text style={[styles.next, styles.nextTypo]}>Next</Text>
      </TouchableOpacity>
      <View style={[styles.progressBar, styles.progressBarFlexBox]}>
        <View style={[styles.stBar, styles.barLayout]} />
        <View style={[styles.ndBar, styles.barLayout]} />
        <View style={[styles.ndBar, styles.barLayout]} />
        <View style={[styles.ndBar, styles.barLayout]} />
        <View style={[styles.ndBar, styles.barLayout]} />
        <View style={[styles.ndBar, styles.barLayout]} />
        <View style={[styles.ndBar, styles.barLayout]} />
        <View style={[styles.ndBar, styles.barLayout]} />
        <View style={[styles.ndBar, styles.barLayout]} />
        <View style={[styles.ndBar, styles.barLayout]} />
      </View>
      <TouchableOpacity
        style={[styles.backbtn, styles.btnnxtLayout]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("ChatPage")}
      >
        <Text style={[styles.back, styles.nextTypo]}>Back</Text>
      </TouchableOpacity>
      <View style={[styles.rectangleParent, styles.progressBarFlexBox]}>
        <Image
          style={styles.frameChild}
          contentFit="cover"
          source={require("../assets/rectangle-1165.png")}
        />
        <View style={styles.groupWrapper}>
          <View style={styles.benParent}>
            <Text style={[styles.ben, styles.benClr]}>Ben</Text>
            <Text style={[styles.am, styles.amTypo]}>09:25 AM</Text>
            <View style={[styles.frameWrapper, styles.wrapperLayout]}>
              <View
                style={[
                  styles.soIWentToTheMarketTodayWrapper,
                  styles.wrapperLayout,
                ]}
              >
                <Text style={[styles.soIWent, styles.benClr]}>
                  So, I went to the market today. It was crowded. Where did you
                  go yesterday?
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quizChildPosition: {
    width: 375,
    left: 0,
    top: 0,
    position: "absolute",
  },
  groupPosition: {
    bottom: "36.36%",
    position: "absolute",
  },
  textPosition: {
    left: "0%",
    position: "absolute",
  },
  textFlexBox: {
    textAlign: "center",
    color: Color.colorBlack,
  },
  optionLayout: {
    padding: Padding.p_3xs,
    height: 140,
    width: 140,
    top: 333,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.colorAliceblue,
    borderRadius: Border.br_mini,
    left: "50%",
    position: "absolute",
  },
  libraryTypo: {
    fontFamily: FontFamily.gothicA1Bold,
    fontWeight: "700",
  },
  optionPosition: {
    top: 499,
    padding: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 140,
    width: 140,
    backgroundColor: Color.colorAliceblue,
    borderRadius: Border.br_mini,
    left: "50%",
    position: "absolute",
  },
  btnnxtLayout: {
    height: 48,
    width: 128,
    top: 729,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: Border.br_mini,
    position: "absolute",
  },
  nextTypo: {
    lineHeight: 16,
    fontFamily: FontFamily.gothicA1Bold,
    fontWeight: "700",
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  progressBarFlexBox: {
    justifyContent: "center",
    flexDirection: "row",
  },
  barLayout: {
    height: 10,
    borderRadius: Border.br_5xs,
    flex: 1,
  },
  benClr: {
    color: Color.colorGray_200,
    textAlign: "left",
  },
  amTypo: {
    fontFamily: FontFamily.gothicA1Regular,
    position: "absolute",
  },
  wrapperLayout: {
    width: 275,
    position: "absolute",
  },
  quizChild: {
    shadowColor: "rgba(17, 18, 34, 0.02)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 20,
    elevation: 20,
    shadowOpacity: 1,
    height: 124,
    backgroundColor: Color.colorWhite,
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
    letterSpacing: 0,
    lineHeight: 20,
    fontWeight: "500",
    fontFamily: FontFamily.robotoMedium,
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
    height: 44,
  },
  library: {
    lineHeight: 12,
    fontSize: FontSize.size_base,
    textAlign: "center",
    color: Color.colorBlack,
  },
  option1: {
    marginLeft: -152.5,
  },
  option3: {
    marginLeft: -154.5,
  },
  option4: {
    marginLeft: 13.5,
  },
  option2: {
    marginLeft: 15.5,
  },
  next: {
    color: Color.colorWhite,
  },
  btnnxt: {
    left: 201,
    backgroundColor: Color.colorMediumpurple,
  },
  stBar: {
    backgroundColor: Color.colorMediumpurple,
  },
  ndBar: {
    backgroundColor: Color.colorGray_100,
    marginLeft: 8,
  },
  progressBar: {
    top: 67,
    right: 66,
    left: 66,
    height: 21,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "absolute",
  },
  back: {
    color: Color.colorGray_100,
  },
  backbtn: {
    left: 47,
    backgroundColor: Color.colorWhitesmoke,
    paddingHorizontal: Padding.p_21xl,
    paddingVertical: Padding.p_mini,
  },
  frameChild: {
    borderRadius: Border.br_12xl,
    width: 46,
    height: 44,
  },
  ben: {
    lineHeight: 14,
    width: 35,
    height: 16,
    textAlign: "left",
    fontFamily: FontFamily.gothicA1Regular,
    position: "absolute",
    fontSize: FontSize.size_base,
    left: 0,
    top: 0,
    color: Color.colorGray_200,
  },
  am: {
    top: 71,
    left: 144,
    fontSize: FontSize.size_3xs,
    lineHeight: 10,
    width: 62,
    height: 12,
    textAlign: "left",
    color: Color.colorGray_100,
  },
  soIWent: {
    fontSize: FontSize.size_xl,
    letterSpacing: 0.2,
    lineHeight: 25,
    textAlign: "left",
    fontFamily: FontFamily.gothicA1Bold,
    fontWeight: "700",
    flex: 1,
  },
  soIWentToTheMarketTodayWrapper: {
    padding: Padding.p_mini,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.colorAliceblue,
    borderRadius: Border.br_mini,
    width: 275,
    left: 0,
    top: 0,
  },
  frameWrapper: {
    top: 34,
    left: 16,
    height: 130,
  },
  benParent: {
    width: 291,
    height: 164,
  },
  groupWrapper: {
    width: 283,
    height: 120,
    marginLeft: 25,
  },
  rectangleParent: {
    marginLeft: -175.5,
    top: 124,
    width: 348,
    height: 164,
    justifyContent: "center",
    flexDirection: "row",
    left: "50%",
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  quiz: {
    height: 812,
    overflow: "hidden",
    width: "100%",
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
});

export default Quiz;
