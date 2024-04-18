import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Text } from "react-native";
import { Color, FontSize, FontFamily } from "../GlobalStyles";

const Loading = () => {
  return (
    <View style={styles.loading}>
      <View style={styles.loadingInner}>
        <View style={styles.loadingInner}>
          <View style={styles.loadingInner}>
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
              <Text style={[styles.text, styles.textPosition]}>9:41</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.loadingChild} />
      <View style={styles.type3Parent}>
        <View style={styles.type3Layout}>
          <Image
            style={[styles.backgroundIcon, styles.text1Position]}
            contentFit="cover"
            source={require("../assets/background1.png")}
          />
          <Image
            style={[styles.backgroundIcon, styles.text1Position]}
            contentFit="cover"
            source={require("../assets/front.png")}
          />
          <Text style={[styles.text1, styles.text1Position]}>90%</Text>
        </View>
        <View style={styles.creatingQuizWrapper}>
          <Text style={styles.creatingQuiz}>Creating quiz...</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  groupPosition: {
    bottom: "36.36%",
    position: "absolute",
  },
  textPosition: {
    left: "0%",
    position: "absolute",
  },
  text1Position: {
    left: "50%",
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
  },
  frame: {
    height: "47.73%",
    width: "14.4%",
    top: "15.91%",
    right: "80%",
    left: "5.6%",
  },
  loadingInner: {
    left: 0,
    width: 375,
    height: 44,
    top: 0,
    position: "absolute",
  },
  loadingChild: {
    top: 331,
    left: 115,
    width: 181,
    height: 223,
    position: "absolute",
  },
  backgroundIcon: {
    marginLeft: -72,
    height: 144,
    width: 144,
    top: 0,
  },
  text1: {
    marginLeft: -34.4,
    top: 50,
    fontSize: FontSize.size_12xl_7,
    fontWeight: "900",
    fontFamily: FontFamily.nunitoBlack,
    color: Color.colorDarkslategray,
    textAlign: "center",
  },
  type3Layout: {
    height: 144,
    width: 144,
  },
  creatingQuiz: {
    fontSize: FontSize.size_5xl,
    letterSpacing: 0.2,
    lineHeight: 26,
    fontWeight: "800",
    fontFamily: FontFamily.gothicA1ExtraBold,
    color: Color.colorGray_200,
    width: 275,
    height: 26,
    textAlign: "center",
  },
  creatingQuizWrapper: {
    flexDirection: "row",
    marginTop: 32,
    alignItems: "center",
  },
  type3Parent: {
    top: 332,
    left: 79,
    width: 217,
    height: 222,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
  },
  loading: {
    backgroundColor: Color.colorWhite,
    flex: 1,
    height: 809,
    overflow: "hidden",
    width: "100%",
  },
});

export default Loading;
