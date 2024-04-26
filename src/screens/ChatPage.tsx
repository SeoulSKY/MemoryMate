import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity
} from "react-native";
import Response from "../components/response";
import Message from "../components/message";
import { MaterialIcons } from "@expo/vector-icons";
import KeyboardAvoidingViewContainer from "../components/KeyboardAvoidingViewContainer";
import { FontAwesome6 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Chat from "../utils/chat";
import {BotProfile, ProfileData} from "../utils/profile";
import {Image} from "expo-image";




const ChatPage = () => {
  const [inputText, setInputText] = useState("");
  const [listData, setListData] = useState<string[]>([]);


  const searchInput = () => {
    setListData((prevList) => [...prevList, inputText]);
    setInputText("");
  };

  //const [image, setImage] = useState<string | null>(null);

  

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
    }
  };

  const [botProfile, setBotProfile] = useState<ProfileData>();

  useEffect(() => {
    BotProfile.getInstance().get().then((profile) => {
      setBotProfile(profile);
    }
  ),[]});



  return (
    <KeyboardAvoidingViewContainer>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          {botProfile && <Image source={botProfile.image!.path} style={[styles.icon, styles.roundedImage]}  />}
          {botProfile &&<Text style={{ fontSize: 20, fontWeight: "400", color: "#323232" }}>{botProfile.name}</Text>}
        </View>
        <FlatList
          style={{ paddingHorizontal: 16, marginBottom: 80 }}
          data={listData}
          renderItem={({ item }) => (
            <View>
              <Message message={item} />
              {/* {image && <Image source={{ uri: image }} style={styles.image} />} */}
              <Response prompt={item} />
            </View>
          
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={pickImage}> 
            <FontAwesome6 name="image" size={20} color="black" />
          </TouchableOpacity>
        
    
          <TextInput
            placeholder="Speak with Ben"
            style={styles.input}
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            selectionColor="#323232"
          />
          <TouchableOpacity onPress={searchInput}>
            <MaterialIcons name="send" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingViewContainer>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingTop: 36,
  },
  image: {
    width: 200,
    height: 200,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    margin: 8,
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  searchBar: {
    backgroundColor: "#ffffff",
    width: "100%",
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 60,
    paddingVertical: 16,
    gap: 8,
  },
  input: {
    backgroundColor: "#fff",
    width: "100%",
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 32,
    borderWidth: 0.1,
  },
  roundedImage: {
    borderRadius: 50, 
  },
});

export default ChatPage;


/* import * as React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { FontSize, Padding, FontFamily, Color, Border } from "../../GlobalStyles";


const ChatPage = () => {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.chatPage}>
      <View style={[styles.chatPageChild, styles.chatPageChildPosition]} />
      <View style={[styles.statusBarWrapper, styles.chatPageChildPosition]}>
        <View style={[styles.statusBarWrapper, styles.chatPageChildPosition]}>
          <Image
            style={styles.excludeIcon}
            contentFit="cover"
            source={require("../../assets/exclude2.png")}
          />
          <Image
            style={styles.excludeIcon1}
            contentFit="cover"
            source={require("../../assets/exclude3.png")}
          />
          <View style={[styles.group, styles.groupPosition]}>
            <Image
              style={styles.vectorIcon}
              contentFit="cover"
              source={require("../../assets/vector1.png")}
            />
            <View style={[styles.rectangle, styles.textPosition]} />
            <View style={styles.rectangle1} />
          </View>
          <View style={[styles.frame, styles.groupPosition]}>
            <Text style={[styles.text, styles.textPosition]}>9:41</Text>
          </View>
        </View>
      </View>
      <View style={[styles.tabBarUihut, styles.ben1Position]}>
        <View style={styles.backParent}>
          <Pressable
            style={styles.back}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Image
              style={styles.icon}
              contentFit="cover"
              source={require("../../assets/back.png")}
            />
          </Pressable>
          <Image
            style={styles.frameChild}
            contentFit="cover"
            source={require("../../assets/rectangle-1092.png")}
          />
          <Text style={[styles.ben, styles.benTypo]}>Ben</Text>
        </View>
        <Image
          style={styles.tabBarUihutChild}
          contentFit="cover"
          source={require("../../assets/ellipse-299.png")}
        />
      </View>
      <View style={styles.groupParent}>
        <View style={styles.frameWrapper}>
          <View
            style={[
              styles.imPrettyGoodJustWentForWrapper,
              styles.wrapperFlexBox,
            ]}
          >
            <Text
              style={[styles.imPrettyGood, styles.ben1Typo]}
            >{`I’m pretty good. Just went 
for a walk and had a coffee.`}</Text>
          </View>
        </View>
        <View style={styles.amWrapper}>
          <Text style={styles.am}>09:25 AM</Text>
        </View>
      </View>
      <View style={[styles.chatPageInner, styles.clipFlexBox]}>
        <View style={[styles.clipAttachmentParent, styles.clipFlexBox]}>
          <View style={styles.clipFlexBox}>
            <Pressable style={styles.clipFlexBox}>
              <Image
                style={styles.mediaIcon}
                contentFit="cover"
                source={require("../../assets/media.png")}
              />
            </Pressable>
          </View>
          <View style={[styles.searchBoxUihut, styles.microphoneFlexBox]}>
            <Text style={[styles.writeYourMessage, styles.helloHowTypo]}>
              Write your message
            </Text>
          </View>
          <Pressable style={[styles.microphone, styles.microphoneFlexBox]}>
            <Image
              style={styles.vectorIcon1}
              contentFit="cover"
              source={require("../../assets/vector2.png")}
            />
          </Pressable>
        </View>
      </View>
      <View style={[styles.rectangleParent, styles.rectanglePosition]}>
        <Image
          style={styles.frameItem}
          contentFit="cover"
          source={require("../../assets/rectangle-11652.png")}
        />
        <View style={styles.groupWrapper}>
          <View style={styles.benParent}>
            <Text style={[styles.ben1, styles.ben1Typo]}>Ben</Text>
            <Text style={[styles.am1, styles.am1Layout]}>09:25 AM</Text>
            <View style={[styles.frameContainer, styles.groupViewPosition]}>
              <View
                style={[styles.helloHowAreYouWrapper, styles.wrapperFlexBox]}
              >
                <Text style={[styles.helloHow, styles.helloHowTypo]}>
                  Hello ! How are you?
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.rectangleGroup, styles.rectanglePosition]}>
        <Image
          style={styles.frameItem}
          contentFit="cover"
          source={require("../../assets/rectangle-11652.png")}
        />
        <View style={styles.groupWrapper}>
          <View style={styles.amParent}>
            <Text style={[styles.am2, styles.am1Layout]}>09:25 AM</Text>
            <Text style={[styles.ben1, styles.ben1Typo]}>Ben</Text>
            <View style={[styles.groupView, styles.groupViewPosition]}>
              <View
                style={[styles.helloHowAreYouWrapper, styles.wrapperFlexBox]}
              >
                <Text style={[styles.ohInterestingDid, styles.ben1Typo]}>
                  Oh interesting! Did you meet anyone you know on your way?
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.todaylbl, styles.wrapperFlexBox]}>
        <Text style={[styles.today, styles.benTypo]}>Today</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatPageChildPosition: {
    width: 375,
    height: 44,
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
  ben1Position: {
    left: 0,
    position: "absolute",
  },
  benTypo: {
    textAlign: "left",
    lineHeight: 16,
    fontSize: FontSize.size_base,
  },
  wrapperFlexBox: {
    padding: Padding.p_3xs,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
  },
  ben1Typo: {
    fontFamily: FontFamily.gothicA1Regular,
    textAlign: "left",
    fontSize: FontSize.size_base,
  },
  clipFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  microphoneFlexBox: {
    marginLeft: 21,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
  },
  helloHowTypo: {
    lineHeight: 12,
    fontFamily: FontFamily.gothicA1Regular,
    textAlign: "left",
  },
  rectanglePosition: {
    marginLeft: -190.5,
    left: "50%",
    flexDirection: "row",
    position: "absolute",
    backgroundColor: Color.colorWhite,
  },
  am1Layout: {
    height: 12,
    color: Color.colorGray_100,
    lineHeight: 10,
    fontSize: FontSize.size_3xs,
    fontFamily: FontFamily.gothicA1Regular,
    textAlign: "left",
    width: 62,
    position: "absolute",
  },
  groupViewPosition: {
    left: 16,
    top: 34,
    position: "absolute",
  },
  chatPageChild: {
    shadowColor: "rgba(17, 18, 34, 0.02)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 20,
    elevation: 20,
    shadowOpacity: 1,
    height: 44,
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
    width: "89.07%",
    top: "0%",
    right: "10.93%",
    bottom: "0%",
    borderRadius: 3,
    borderStyle: "solid",
    borderColor: Color.colorBlack,
    borderWidth: 1,
    opacity: 0.35,
    height: "100%",
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
    fontWeight: "500",
    fontFamily: FontFamily.robotoMedium,
    textAlign: "center",
    color: Color.colorBlack,
    lineHeight: 20,
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
  icon: {
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  back: {
    width: 36,
    height: 45,
  },
  frameChild: {
    height: 58,
    marginLeft: 20,
    width: 62,
    borderRadius: Border.br_12xl,
  },
  ben: {
    fontWeight: "700",
    fontFamily: FontFamily.gothicA1Bold,
    color: Color.colorGray_200,
    marginLeft: 20,
  },
  backParent: {
    zIndex: 0,
    flexDirection: "row",
    width: 375,
  },
  tabBarUihutChild: {
    left: -30,
    width: 136,
    height: 56,
    display: "none",
    zIndex: 1,
    top: 0,
    position: "absolute",
  },
  tabBarUihut: {
    top: 44,
  },
  imPrettyGood: {
    color: Color.colorWhite,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  imPrettyGoodJustWentForWrapper: {
    backgroundColor: Color.colorMediumpurple,
    borderRadius: Border.br_mini,
    padding: Padding.p_3xs,
    left: 0,
    top: 0,
  },
  frameWrapper: {
    width: 223,
    height: 60,
  },
  am: {
    textAlign: "right",
    color: Color.colorGray_100,
    lineHeight: 10,
    fontSize: FontSize.size_3xs,
    height: 10,
    width: 44,
    fontFamily: FontFamily.gothicA1Regular,
    left: 0,
    top: 0,
    position: "absolute",
  },
  amWrapper: {
    marginTop: 10,
    height: 10,
    width: 44,
  },
  groupParent: {
    marginLeft: -46.5,
    top: 359,
    width: 240,
    left: "50%",
    position: "absolute",
  },
  mediaIcon: {
    width: 43,
    height: 44,
    overflow: "hidden",
  },
  writeYourMessage: {
    fontSize: 12,
    width: 123,
    height: 9,
    color: Color.colorGray_100,
  },
  searchBoxUihut: {
    borderRadius: 12,
    backgroundColor: Color.colorWhitesmoke,
    height: 48,
    paddingHorizontal: Padding.p_smi,
    paddingVertical: 11,
    minWidth: 204,
    flex: 1,
  },
  vectorIcon1: {
    width: 22,
    height: 35,
  },
  microphone: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clipAttachmentParent: {
    width: 353,
    height: 83,
  },
  chatPageInner: {
    right: 0,
    bottom: 1,
    left: 1,
    height: 83,
    position: "absolute",
  },
  frameItem: {
    width: 46,
    borderRadius: Border.br_12xl,
    height: 44,
  },
  ben1: {
    lineHeight: 14,
    width: 35,
    height: 16,
    color: Color.colorGray_200,
    left: 0,
    position: "absolute",
    top: 0,
  },
  am1: {
    top: 71,
    left: 144,
  },
  helloHow: {
    letterSpacing: 0.2,
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    lineHeight: 12,
  },
  helloHowAreYouWrapper: {
    backgroundColor: Color.colorAliceblue,
    borderRadius: Border.br_mini,
    padding: Padding.p_3xs,
    left: 0,
    top: 0,
  },
  frameContainer: {
    width: 171,
    height: 32,
  },
  benParent: {
    width: 205,
    height: 83,
  },
  groupWrapper: {
    width: 235,
    height: 84,
    marginLeft: 25,
  },
  rectangleParent: {
    top: 174,
    width: 310,
    height: 113,
  },
  am2: {
    top: 110,
    left: 232,
  },
  ohInterestingDid: {
    width: 247,
    letterSpacing: 0.2,
    color: Color.colorGray_200,
    height: 45,
    lineHeight: 20,
  },
  groupView: {
    width: 267,
    height: 65,
  },
  amParent: {
    width: 294,
    height: 122,
  },
  rectangleGroup: {
    top: 511,
    width: 361,
    height: 134,
  },
  today: {
    fontWeight: "300",
    fontFamily: FontFamily.gothicA1Light,
    color: Color.colorBlack,
  },
  todaylbl: {
    top: 109,
    right: 132,
    left: 132,
    height: 26,
  },
  chatPage: {
    height: 812,
    overflow: "hidden",
    width: "100%",
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
});

export default ChatPage;
 */