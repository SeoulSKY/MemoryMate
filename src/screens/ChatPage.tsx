import React, {useEffect, useState} from "react";
import {
  Actions,
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  SystemMessage,
} from "react-native-gifted-chat";
import {SafeAreaView} from "react-native-safe-area-context";
import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {BorderRadius, Colour} from "../constants";
import {Feather, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {BotProfile, Gender, Participant, ProfileData, UserProfile} from "../utils/profile";
import {Image} from "expo-image";
import {ImageData, MimeType} from "../utils/image";
import Avatar from "../components/Avatar";
import Chat from "../utils/chat";
import {rootLogger} from "../index";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";

const logger = rootLogger.extend("Chat");

const mockBotProfile: ProfileData = {
  name: "Ben",
  image: {
    path: require("../../assets/profiles/male/40_0.png"),
    width: 256,
    height: 256,
    mimeType: "image/png",
  },
  age: 40,
  gender: Gender.MALE,
};

const mockUserProfile: ProfileData = {
  name: "Alice",
  age: 40,
  gender: Gender.FEMALE,
};

const userId = 1;
const botId = 2;

export default function ChatPage() {
  const [chat, setChat] = useState<Chat>();
  const [botProfile, setBotProfile] = useState<ProfileData>();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [image, setImage] = useState<ImageData>();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const [botProfile, setBotProfile] = useState<ProfileData>();
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  function appendMessage(message: IMessage) {
    setMessages(previousMessages => [...previousMessages, message]);
  }

  /**
   * Set the bot profile and the initial message
   */
  useEffect(() => {
    Promise.all([
      BotProfile.getInstance().create(mockBotProfile),
      UserProfile.getInstance().create(mockUserProfile),
    ]).then(async ([botProfile]) => {
      const chat = await Chat.getInstance();
      setChat(chat);
      setBotProfile(botProfile);
      setMessages((await chat.getHistory()).map((message, i) => {
        return {
          _id: i,
          text: message.text,
          createdAt: message.timestamp,
          user: {
            _id: message.author === Participant.BOT ? botId : userId,
            name: message.author === Participant.BOT ? botProfile.name : undefined,
            avatar: message.author === Participant.BOT ? botProfile.image!.path : undefined
          },
          image: message.images.length > 0 ? message.images[0].path as string : undefined,
        };
      }));
    }).catch(logger.error);
  }, []);

  /**
   * Pick an image from the image library
   */
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

  /**
   * Render the chat page
   */
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back-sharp" size={30} color="black" onPress={async () => {
              
          navigation.navigate("Home");
              
        }} />
        {botProfile && <Avatar imagePath={botProfile.image!.path} name={botProfile.name}/>}
      </View>
    
      <GiftedChat
        messages={messages}
        placeholder={`Press here to chat with ${botProfile?.name}`}
        isTyping={isTyping}
        disableComposer={isTyping}
        isCustomViewBottom
        renderAvatarOnTop
        alignTop
        inverted={false}
        infiniteScroll
        user={{
          _id: userId,
        }}
        timeTextStyle={{
          left: {
            color: Colour.black,
          },
          right: {
            color: Colour.white,
          },
        }}
        onSend={async messages => {
          const message = messages[0];
          if (image !== undefined) {
            message.image = image.path as string;
          }

          setImage(undefined);
          appendMessage(message);

          setIsTyping(true);
          const reply = await chat!.sendMessage(message.text, image !== undefined ? [image] : undefined);
          appendMessage({
            _id: Date.now(),
            text: reply.text,
            createdAt: reply.timestamp,
            user: {
              _id: botId,
              name: botProfile!.name,
              avatar: botProfile!.image?.path,
            },
          });

          setIsTyping(false);
        }}
        renderSystemMessage={props => {
          return (
            <SystemMessage
              {...props}
              currentMessage={messages[-1]}
            />
          );
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
                  borderTopLeftRadius: 0,
                },
                right:{
                  backgroundColor: Colour.primary,
                  borderTopRightRadius: 0,
                }
              }}
            />
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
              <MaterialCommunityIcons name="send-circle-outline" size={34} color="black" />
            </Send>
          );
        }}
        renderInputToolbar={props=>{
          return(
            <InputToolbar
              {...props}
              containerStyle={styles.input}
            />
          );
        }}
        renderChatFooter={() => {
          return (
            <View style ={{backgroundColor:Colour.lightGray,margin:15}}>
              {image && <Image source={image.path} style={styles.pickedImage}/>}
              {image &&<TouchableOpacity 
                onPress={() => setImage(undefined)}
                style={styles.removePickedImage}
              >
                  
                <Text >X</Text>
              </TouchableOpacity>}
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
  input: {
    backgroundColor:Colour.lightGray,
    borderRadius: BorderRadius.medium,
    marginHorizontal: "2%",
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
});
