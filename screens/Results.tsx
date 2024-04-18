import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  //Pressable,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { Padding, Color, Border, FontSize, FontFamily } from "../GlobalStyles";

const Results = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.results}>
      <View style={[styles.resultsChild, styles.frameParentPosition]} />
      <View style={[styles.statusBarWrapper, styles.frameParentPosition]}>
        <View style={[styles.statusBarWrapper, styles.frameParentPosition]}>
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
              style={[styles.vectorIcon, styles.iconLayout]}
              contentFit="cover"
              source={require("../assets/vector1.png")}
            />
            <View style={[styles.rectangle, styles.textPosition]} />
            <View style={styles.rectangle1} />
          </View>
          <View style={[styles.frame, styles.groupPosition]}>
            <Text style={[styles.text, styles.textPosition]}>9:41</Text>
          </View>
        </View>
      </View>
      <View style={styles.groupParent}>
        <View style={[styles.frameParent, styles.frameParentPosition]}>
          <View style={[styles.benWrapper, styles.wrapperSpaceBlock]}>
            <Text style={[styles.ben, styles.benClr]}>Ben</Text>
          </View>
          <Text style={styles.am}>09:25 AM</Text>
          <View style={[styles.frameWrapper, styles.wrapperPosition]}>
            <View
              style={[
                styles.niceTryButThereIsRoomFoWrapper,
                styles.btnreturntochatFlexBox,
              ]}
            >
              <Text style={[styles.niceTryBut, styles.benClr]}>
                Nice try! But there is room for improvement.
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.rectangleWrapper, styles.wrapperSpaceBlock]}>
          <Image
            style={styles.frameChild}
            contentFit="cover"
            source={require("../assets/rectangle-11651.png")}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.btnreturntochat, styles.btnreturntochatFlexBox]}
        activeOpacity={0.2}
        onPress={() => navigation.navigate("Quiz")}
      >
        <Text style={styles.returnToChat}>Return to chat</Text>
      </TouchableOpacity>
      <View style={styles.type3}>
        <View style={styles.backgroundPosition}>
          <Image
            style={[styles.backgroundIcon, styles.backgroundPosition]}
            contentFit="cover"
            source={require("../assets/background.png")}
          />
          <Image
            style={[styles.backgroundIcon, styles.backgroundPosition]}
            contentFit="cover"
            source={require("../assets/front.png")}
          />
          <Text style={styles.text1}>?/10</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frameParentPosition: {
    left: 0,
    position: "absolute",
  },
  groupPosition: {
    bottom: "36.36%",
    position: "absolute",
  },
  iconLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  textPosition: {
    left: "0%",
    position: "absolute",
  },
  wrapperSpaceBlock: {
    padding: Padding.p_3xs,
    top: 0,
  },
  benClr: {
    color: Color.colorGray_200,
    textAlign: "left",
  },
  wrapperPosition: {
    height: 102,
    left: 0,
    right: 0,
  },
  btnreturntochatFlexBox: {
    borderRadius: Border.br_mini,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  backgroundPosition: {
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    position: "absolute",
  },
  resultsChild: {
    shadowColor: "rgba(17, 18, 34, 0.02)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 20,
    elevation: 20,
    shadowOpacity: 1,
    height: 62,
    right: 0,
    left: 0,
    top: 0,
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
    opacity: 0.4,
    position: "absolute",
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
    color: Color.colorBlack,
    textAlign: "center",
    width: "100%",
    left: "0%",
  },
  frame: {
    height: "47.73%",
    width: "14.4%",
    top: "15.91%",
    right: "80%",
    left: "5.6%",
  },
  statusBarWrapper: {
    width: 375,
    height: 44,
    top: 0,
  },
  ben: {
    lineHeight: 14,
    textAlign: "left",
    fontFamily: FontFamily.gothicA1Regular,
    fontSize: FontSize.size_base,
  },
  benWrapper: {
    right: 117,
    left: 122,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: Padding.p_3xs,
    height: 35,
    position: "absolute",
  },
  am: {
    top: 102,
    left: 174,
    fontSize: FontSize.size_3xs,
    lineHeight: 10,
    color: Color.colorGray_100,
    width: 41,
    height: 10,
    textAlign: "left",
    fontFamily: FontFamily.gothicA1Regular,
    position: "absolute",
  },
  niceTryBut: {
    fontSize: FontSize.size_xl,
    letterSpacing: 0.2,
    lineHeight: 26,
    fontWeight: "800",
    fontFamily: FontFamily.gothicA1ExtraBold,
    width: 275,
    textAlign: "left",
  },
  niceTryButThereIsRoomFoWrapper: {
    backgroundColor: Color.colorAliceblue,
    height: 102,
    left: 0,
    right: 0,
    padding: Padding.p_3xs,
    top: 0,
  },
  frameWrapper: {
    top: 66,
    position: "absolute",
  },
  frameParent: {
    top: 26,
    height: 168,
    right: 0,
    left: 0,
  },
  frameChild: {
    borderRadius: Border.br_12xl,
    width: 74,
    height: 68,
  },
  rectangleWrapper: {
    right: 178,
    left: 29,
    position: "absolute",
  },
  groupParent: {
    top: 167,
    right: 34,
    left: 40,
    height: 194,
    position: "absolute",
  },
  returnToChat: {
    lineHeight: 16,
    fontWeight: "700",
    fontFamily: FontFamily.gothicA1Bold,
    color: Color.colorWhite,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  btnreturntochat: {
    top: 704,
    left: 79,
    backgroundColor: Color.colorMediumpurple,
    width: 217,
    height: 53,
  },
  backgroundIcon: {
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  text1: {
    top: 52,
    left: 42,
    fontSize: FontSize.size_12xl_7,
    fontWeight: "900",
    fontFamily: FontFamily.nunitoBlack,
    color: Color.colorDarkslategray,
    width: 67,
    height: 35,
    textAlign: "center",
    position: "absolute",
  },
  type3: {
    top: 466,
    right: 109,
    bottom: 196,
    left: 116,
    position: "absolute",
  },
  results: {
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
    backgroundColor: Color.colorWhite,
  },
});

export default Results;
