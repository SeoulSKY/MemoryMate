import React, {useEffect, useRef, useState} from "react";
import {Bubble, GiftedChat, IMessage,} from "react-native-gifted-chat";
import {SafeAreaView} from "react-native-safe-area-context";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {BorderRadius, Colour, FontFamily, FontSize} from "../constants";
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {BotProfile, Participant, ProfileData, UserProfile} from "../utils/profile";
import {Image} from "expo-image";
import {ImageData, MimeType} from "../utils/image";
import Avatar from "../components/Avatar";
import Chat from "../utils/chat";
import {rootLogger} from "../index";
import {StackNavigationProp} from "@react-navigation/stack";
import {ParamListBase, useNavigation} from "@react-navigation/native";
import {HttpError} from "../utils/errors";
import Quiz from "../utils/quiz";
import {HttpStatusCode, sleep} from "../utils";

const logger = rootLogger.extend("Chat");

const userId = 1;
const botId = 2;

const minNumUserMessagesForQuiz = 10;
const quizPercentage = 0.1;

const quizLoadingMessages = [
  "Let's engage our minds with a simple quiz!",
  "Let's have some fun with a quiz to keep our brains active!",
  "Here's a little quiz to exercise our minds!",
  "Let's try a quiz together to keep our brains engaged!",
  "Let's enjoy a quiz to keep our minds sharp!",
  "Let's have a little fun with a quiz to challenge our thinking!",
  "Here's a quiz to stimulate our minds!",
  "Let's explore a quiz together to keep our brains active!",
  "Let's have some fun with a quiz to exercise our thinking!",
  "Let's enjoy a quiz together to keep our minds alert!",
];

export default function () {
  const chatContainer = useRef<FlatList<IMessage>>(null);
  const [chat, setChat] = useState<Chat>();
  const [botProfile, setBotProfile] = useState<ProfileData>();

  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<IMessage[]>([]);
  const [image, setImage] = useState<ImageData>();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  function appendMessage(message: IMessage) {
    setHistory(previousMessages => [...previousMessages, message]);
  }

  async function init() {
    if (!await BotProfile.getInstance().has() || !await UserProfile.getInstance().has()) {
      navigation.navigate("SignUp");
      return;
    }

    const bot = await BotProfile.getInstance().get();

    setBotProfile(bot);
    const chat = await Chat.getInstance();
    setChat(chat);

    setHistory((await chat.getHistory()).map((message, i) => {
      return {
        _id: i,
        text: message.text,
        createdAt: message.timestamp,
        user: {
          _id: message.author === Participant.BOT ? botId : userId,
          name: message.author === Participant.BOT ? bot.name : undefined,
          avatar: message.author === Participant.BOT ? bot.image!.path : undefined
        },
        image: message.images.length > 0 ? message.images[0].path as string : undefined,
      };
    }));
  }

  useEffect(() => {
    init().catch(logger.error);
  }, []);

  useEffect(() => {
    chatContainer.current?.scrollToEnd({animated: true});
  }, [history]);

  useEffect(() => {
    return navigation.addListener("focus",() => {
      init().catch(logger.error);
    });
  }, [navigation]);

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
    <SafeAreaView style={styles.container} onStartShouldSetResponder={() => {
      Keyboard.dismiss();
      return false;
    }}>
      <View style={styles.header}>
        <Ionicons name="arrow-back-sharp" size={30} color="black" onPress={async () => {

          navigation.navigate("Home");

        }} />
        {botProfile && <Avatar
          imagePath={botProfile.image!.path}
          name={botProfile.name}
          style={styles.avatar}
          imageStyle={styles.avatarImage}
        />}
      </View>
    
      <GiftedChat
        messageContainerRef={chatContainer}
        messages={history}
        placeholder={`Press here to chat with ${botProfile?.name}`}
        isTyping={isTyping}
        renderAvatarOnTop
        alignTop
        inverted={false}
        infiniteScroll
        scrollToBottom
        user={{
          _id: userId,
        }}
        listViewProps={{
          style: styles.listBox,
        }}
        lightboxProps={{
          style: styles.lightBox,
          underlayColor: "rgba(0, 0, 0, 0)",
        }}
        timeTextStyle={{
          left: {
            color: Colour.black,
          },
          right: {
            color: Colour.white,
          },
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  fontFamily: FontFamily.robotoMedium,
                  color: Colour.white,
                },
                left:{
                  fontFamily: FontFamily.robotoMedium,
                  color: Colour.black,
                }
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: Colour.secondary,
                  borderTopLeftRadius: 0,
                  marginVertical: "1%",
                },
                right:{
                  backgroundColor: Colour.primary,
                  borderTopRightRadius: 0,
                  marginVertical: "1%",
                }
              }}
            />
          );
        }}
        renderInputToolbar={() => <View/>}
      />
      <KeyboardAvoidingView behavior={"position"}>
        <View style={styles.imagePreviewContainer}>
          {image && <Image source={image.path} style={[styles.imagePreview, {aspectRatio: image.width / image.height}]}>
            <TouchableOpacity
              onPress={() => setImage(undefined)}
              style={styles.imagePreviewButton}
            >
              <Text style={styles.imagePreviewText}>×</Text>
            </TouchableOpacity>
          </Image>}
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={async () => {
            const image = await pickImage();
            if (image !== null) {
              setImage(image);
            }
          }}>
            <MaterialCommunityIcons name="image" style={styles.inputButtonText} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            maxLength={256}
            editable={!isTyping}
            placeholder={`Press here to chat with ${botProfile?.name}`}
          />
          {input && input.trim().length !== 0 && <TouchableOpacity onPress={async() => {
            const imageToSend = image && {...image};
            const textToSend = input.slice();

            setImage(undefined);
            setInput("");

            appendMessage({
              _id: Date.now(),
              text: input,
              createdAt: Date.now(),
              user: {
                _id: userId,
              },
              image: imageToSend && imageToSend.path as string,
            });

            setIsTyping(true);
            let reply;
            try {
              reply = await chat!.sendMessage(textToSend, imageToSend && [imageToSend]);
            } catch (e) {
              let message;
              if (e instanceof HttpError) {
                if (e.status === HttpStatusCode.TOO_MANY_REQUESTS) {
                  message = "I'm sorry, I'm currently busy. Let's chat later.";
                } else {
                  logger.error(e);
                  message = "I'm sorry, something happened on my end. Let's chat later.";
                }
              } else {
                logger.error(e);
                message = "I'm sorry, something happened on my end. Let's chat later.";
              }

              imageToSend && setImage(imageToSend);
              setInput(textToSend);

              appendMessage({
                _id: Date.now(),
                text: message,
                createdAt: Date.now(),
                user: {
                  _id: botId,
                  name: botProfile!.name,
                  avatar: botProfile!.image?.path,
                },
              });

              setIsTyping(false);
              return;
            }

            let isQuiz = Math.random() < quizPercentage &&
              history.filter(m => m.user._id === userId).length >= minNumUserMessagesForQuiz;

            if (isQuiz) {
              try {
                await Quiz.getInstance().create();
              } catch (e) {
                logger.error(e);

                // continue chat if failed to create quiz
                isQuiz = false;
              }
            }

            setIsTyping(false);

            appendMessage({
              _id: Date.now(),
              text: isQuiz ? quizLoadingMessages[Math.floor(Math.random() * quizLoadingMessages.length)] : reply.text,
              createdAt: reply.timestamp,
              user: {
                _id: botId,
                name: botProfile!.name,
                avatar: botProfile!.image?.path,
              },
            });

            if (isQuiz) {
              await sleep(3000);
              navigation.navigate("Quiz");
            }
          }}>
            <MaterialCommunityIcons name="send-circle-outline" style={styles.inputButtonText} />
          </TouchableOpacity>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: "2%",
    paddingTop: "2%",
    marginTop: "auto",
    marginBottom: "2%",
    zIndex: 1,
    borderTopColor: Colour.lightGray,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor:Colour.lightGray,
    fontSize: FontSize.small,
    color: Colour.black,
    fontFamily: FontFamily.robotoMedium,
    paddingHorizontal: "3%",
    paddingVertical: "3%",
    borderRadius: BorderRadius.medium,
    marginHorizontal: "1%",
  },
  inputButtonText: {
    color: Colour.primary,
    fontSize: FontSize.large,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "2%",
  },
  avatar: {
    marginHorizontal: "2%",
  },
  avatarImage: {
    width: "12%",
  },
  imagePreviewContainer: {
    backgroundColor: Colour.lightGray,
    borderRadius: BorderRadius.medium,
  },
  imagePreview: {
    width: "30%",
    height: "auto",
    borderRadius: BorderRadius.medium,
    margin: 5
  },
  imagePreviewButton:{
    minWidth: 30,
    minHeight: 30,
    height: "20%",
    aspectRatio: 1,
    margin: "5%",
    backgroundColor: Colour.white,
    borderRadius: 1000000,
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreviewText: {
    textAlign: "center",
    color: Colour.black,
    fontSize: FontSize.medium,
    fontFamily: FontFamily.robotoMedium,
  },
  lightBox: {
    padding: "1%",
  },
  listBox: {
    marginBottom: "-10%",
    borderTopColor: Colour.lightGray,
    borderTopWidth: 1,
  },
});
