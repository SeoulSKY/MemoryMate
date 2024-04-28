import React, {useEffect, useState} from "react";
import {Actions, Bubble, GiftedChat, IMessage, InputToolbar, Send} from "react-native-gifted-chat";
import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet, View} from "react-native";
import {Colour} from "../constants";
import {Feather, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {Gender, ProfileData} from "../utils/profile";
import {Image} from "expo-image";
import {ImageData, MimeType} from "../utils/image";
import Avatar from "../components/Avatar";


export default function ChatPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [image, setImage] = useState<ImageData>();

  const [botProfile, setBotProfile] = useState<ProfileData>();

  useEffect(() => {
    setBotProfile({
      name: "Ben",
      image: {
        path: require("../../assets/profiles/male/40_0.png"),
        width: 256,
        height: 256,
        mimeType: "image/png",
      },
      age: 40,
      gender: Gender.MALE,
    });

    setMessages([
      {
        _id: 1,
        text: "Hello, How can I help you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name:  botProfile && botProfile.name,
          avatar: botProfile && botProfile.image!.path,
        },
      },
    ]);
  }, []);

  // useEffect(() => {
  //   BotProfile.getInstance().get().then((profile) => {
  //     setBotProfile(profile);
  //   }
  //   ),[];});


  async function pickImage(): Promise<ImageData | null> {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets.map(asset => {
      return {
        path: asset.uri,
        width: asset.width,
        height: asset.height,
        mimeType: asset.mimeType as MimeType,
      };
    })[0];
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back-sharp" size={30} color="black" />
        {botProfile && <Avatar imagePath={botProfile.image!.path} name={botProfile.name}/>}
      </View>
    
      <GiftedChat
        messages={messages}
        onSend={messages => {
          const message = messages[0];
          if (image !== undefined) {
            message.image = image.path as string;
          }

          setMessages(previousMessages => [message, ...previousMessages]);

          setImage(undefined);
        }}
        renderUsernameOnMessage={true}
        renderAvatarOnTop={true}
        user={{
          _id: 1,
        }}
        renderMessageImage={props =>
          <Image
            {...props}
            source={props.currentMessage?.image}
            style={{width: 200, height: 200, borderRadius: 10}}
          />
        }
       
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: Colour.white,
                },
                left:{
                  color: Colour.black,
                }
                
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: Colour.secondary,
                },
                right:{
                  backgroundColor: Colour.primary,
                }
              }}>
            </Bubble>
          );
        }}
        renderActions={props=>{
          return(
            <Actions 
              {...props}
              icon={() => <Feather name="image" size={28} color="black" />}
              options={{
                "Choose From Library": async () => {
                  const image = await pickImage();
                  if (image !== null) {
                    setImage(image);
                  }
                },
                Cancel: () => {

                },
              }}
            />
          );
        }}
        renderSend={props=> {
          return (
            <Send {...props}>
              <View style={{marginRight: 10, marginBottom: 4}}>
                <MaterialCommunityIcons name="send-circle-outline" size={34} color="black" />
              </View>
            </Send>
          );
        }}
        renderInputToolbar={props=>{
          return(
            <InputToolbar  {...props}
              containerStyle={
                {backgroundColor:Colour.lightGray,height:46,borderRadius:20,marginRight:2,marginLeft:2,marginBottom:5}}>
            </InputToolbar>
          );
        }}
        renderChatFooter={() => {
          return (
            <View>
              {image && <Image source={image.path} style={{width: 200, height: 200}}/>}
            </View>
          );
        }}
      />
    
    </SafeAreaView>
  
  );
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputToolbarContainer:{
    flex: 1,
    flexDirection: "row"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    margin: 8,
    gap: 8,
    borderBottomColor: Colour.lightGray,
    paddingBottom:8,
    borderBottomWidth:1,
  },
  icon: {
    width: 42,
    height: 42,
    marginLeft: 15,
  },
  roundedImage: {
    borderRadius: 50,
  },
});
