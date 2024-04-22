import * as React from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  //Pressable,
  TouchableOpacity,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { Color, Padding, FontSize, FontFamily, Border } from "../../GlobalStyles";

const Home = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  return (
    <View style={[styles.home, styles.homeLayout]}>
      <View style={[styles.homePage, styles.homePagePosition]}>
        <Image
          style={[styles.homePageChild, styles.homePosition]}
          contentFit="cover"
          source={require("../../assets/ellipse-1227.png")}
        />
        <Image
          style={[styles.homepagescreenIcon, styles.iconLayout]}
          contentFit="cover"
          source={require("../../assets/homepagescreen.png")}
        />
        <Image
          style={[styles.homePageItem, styles.homePosition]}
          contentFit="cover"
          source={require("../../assets/ellipse-1226.png")}
        />
        <View style={[styles.statusBar, styles.homePagePosition]}>
          <View style={styles.frame}>
            <View style={[styles.frame1, styles.textPosition]}>
              <Text style={[styles.text, styles.textFlexBox]}>9:41</Text>
            </View>
            <Image
              style={styles.excludeIcon}
              contentFit="cover"
              source={require("../../assets/exclude.png")}
            />
          </View>
          <View style={styles.frame2}>
            <View style={[styles.frame3, styles.frame3Position]}>
              <Image
                style={[styles.vectorIcon, styles.frame3Position]}
                contentFit="cover"
                source={require("../../assets/vector.png")}
              />
              <View style={styles.rectangle} />
            </View>
            <Image
              style={styles.excludeIcon1}
              contentFit="cover"
              source={require("../../assets/exclude1.png")}
            />
          </View>
        </View>
        <View style={styles.back} />
        <TouchableOpacity
          style={styles.btnstart}
          activeOpacity={0.2}
          onPress={() => navigation.navigate("SignUp2")}
        >
          <Text
            style={[styles.letsGetStarted, styles.memoryMateTypo]}
          >{"Let's get started!    "}</Text>
        </TouchableOpacity>
        <View style={[styles.title, styles.titleSpaceBlock]}>
          <Text style={[styles.memoryMate, styles.memoryMateTypo]}>
            Memory Mate
          </Text>
        </View>
        <View style={[styles.description, styles.titleSpaceBlock]}>
          <Text
            style={[styles.feelingForgetfulNeed, styles.textFlexBox]}
          >{`Feeling forgetful? Need a chat buddy?

Chat with our friendly and helpful AI companion designed specifically for those living with dementia. 

Play brain games to keep your mind sharp.`}</Text>
        </View>
        <View style={styles.memorymatelogo}>
          <Image
            style={styles.groupIcon}
            contentFit="cover"
            source={require("../../assets/group.png")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeLayout: {
    height: 812,
    overflow: "hidden",
    backgroundColor: Color.colorWhite,
  },
  homePagePosition: {
    width: 375,
    left: 0,
    top: 0,
    position: "absolute",
  },
  homePosition: {
    opacity: 0.63,
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
  textFlexBox: {
    textAlign: "center",
    color: Color.colorWhite,
  },
  frame3Position: {
    right: "0%",
    position: "absolute",
  },
  memoryMateTypo: {
    fontWeight: "700",
    textAlign: "center",
    color: Color.colorWhite,
  },
  titleSpaceBlock: {
    padding: Padding.p_3xs,
    alignItems: "center",
    position: "absolute",
  },
  homePageChild: {
    top: -43,
    left: -19,
    width: 410,
    height: 414,
  },
  homepagescreenIcon: {
    right: 0,
    bottom: 0,
    left: 0,
    top: 0,
    maxWidth: "100%",
    position: "absolute",
  },
  homePageItem: {
    top: -233,
    left: -367,
    width: 1045,
    height: 1045,
    display: "none",
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
  frame1: {
    height: "98.59%",
    width: "19.29%",
    right: "80.71%",
    bottom: "1.41%",
    top: "0%",
  },
  excludeIcon: {
    width: 17,
    height: 11,
  },
  frame: {
    top: 7,
    left: 21,
    width: 280,
    height: 21,
    position: "absolute",
    overflow: "hidden",
  },
  vectorIcon: {
    height: "36.36%",
    width: "5.45%",
    top: "36.36%",
    bottom: "27.27%",
    left: "94.55%",
    opacity: 0.4,
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  rectangle: {
    height: "63.64%",
    width: "73.18%",
    top: "18.18%",
    right: "18.64%",
    bottom: "18.18%",
    left: "8.18%",
    borderRadius: 1,
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  frame3: {
    height: "97.35%",
    width: "52.38%",
    bottom: "2.65%",
    left: "47.62%",
    borderRadius: 3,
    borderStyle: "solid",
    borderColor: Color.colorGray_300,
    borderWidth: 1,
    top: "0%",
  },
  excludeIcon1: {
    width: 15,
    height: 11,
  },
  frame2: {
    top: 17,
    left: 306,
    width: 42,
    height: 11,
    position: "absolute",
    overflow: "hidden",
  },
  statusBar: {
    height: 44,
  },
  back: {
    top: 133,
    left: 24,
    width: 24,
    height: 24,
    transform: [
      {
        rotate: "90deg",
      },
    ],
    position: "absolute",
    overflow: "hidden",
  },
  letsGetStarted: {
    fontSize: FontSize.size_xl,
    lineHeight: 16,
    fontFamily: FontFamily.gothicA1Bold,
    width: 199,
    height: 16,
  },
  btnstart: {
    top: 694,
    right: 69,
    left: 67,
    borderRadius: Border.br_mini,
    backgroundColor: Color.colorMediumpurple,
    paddingHorizontal: Padding.p_xl,
    paddingVertical: Padding.p_lg,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  memoryMate: {
    fontSize: FontSize.size_24xl,
    lineHeight: 78,
    fontFamily: FontFamily.iBMPlexSansBold,
  },
  title: {
    top: 146,
    right: 52,
    left: 38,
    justifyContent: "center",
  },
  feelingForgetfulNeed: {
    fontSize: FontSize.size_5xl,
    lineHeight: 26,
    fontWeight: "800",
    fontFamily: FontFamily.nanumGothicExtraBold,
    width: 284,
  },
  description: {
    marginLeft: -143.5,
    top: 297,
    left: "50%",
    width: 304,
    height: 326,
    justifyContent: "space-between",
  },
  groupIcon: {
    width: 83,
    height: 75,
  },
  memorymatelogo: {
    top: 64,
    right: 132,
    left: 132,
    paddingHorizontal: Padding.p_sm,
    paddingVertical: Padding.p_smi,
    position: "absolute",
    overflow: "hidden",
  },
  homePage: {
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    overflow: "hidden",
    height: 812,
    backgroundColor: Color.colorWhite,
  },
  home: {
    flex: 1,
    overflow: "hidden",
    width: "100%",
  },
});

export default Home;
