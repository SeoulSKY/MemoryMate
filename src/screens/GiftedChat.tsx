import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    Button,
  StyleSheet,
  TouchableOpacity,
 
} from "react-native";
import Avatar from "../components/Avatar";
import { Bubble } from 'react-native-gifted-chat'
import {Colour} from '../constants'
import { InputToolbar } from 'react-native-gifted-chat'
import { Text } from 'react-native'
import { View } from 'react-native'
import { Feather } from '@expo/vector-icons';
import { Actions } from 'react-native-gifted-chat'
import * as ImagePicker from 'expo-image-picker';
import {BotProfile, ProfileData} from "../utils/profile";
import {Image} from "expo-image";
import { Ionicons } from '@expo/vector-icons';
import { Send } from 'react-native-gifted-chat';
import { MaterialCommunityIcons } from '@expo/vector-icons';




export default function ChatGifted() {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [image, setImage] = useState<string | null>(null);

  const [botProfile, setBotProfile] = useState<ProfileData>();

  useEffect(() => {
    BotProfile.getInstance().get().then((profile) => {
      setBotProfile(profile);
    }
  ),[]});


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello, How can I help you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name:  botProfile && botProfile.name,
          avatar: botProfile && botProfile.image!.path,
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <Ionicons name="arrow-back-sharp" size={30} color="black" />
            {botProfile && <Image source={botProfile.image!.path} style={[styles.icon, styles.roundedImage]}  />}
            {botProfile &&<Text style={{ fontSize: 20, fontWeight: "400", color: "#323232" }}>{botProfile.name}</Text>}
        </View>
    
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}          
        renderUsernameOnMessage={true} 
        renderAvatarOnTop={true}
        user={{
          _id: 1,
          name:  botProfile && botProfile.name,
          avatar: botProfile && botProfile.image!.path,
          
        }}
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
                    backgroundColor: Colour.gray,
                  },
                  right:{
                    backgroundColor: Colour.secondary,
                    
                  }
                }}
              />
            );
          }}
          renderActions={props=>{
            return(
                <Actions 
                {...props}
                icon={()=>{return(<Feather name="image" size={30} color="black" />)}}
                options={{'Choose From Library': () => {
                    pickImage();
                    console.log('Choose From Library');
                  },
                  Cancel: () => {
                    console.log('Cancel');
                  },}}
                
            
                >

                </Actions>
         
            )
          }}
          renderSend = {props=> {
            return (
                <Send
                    {...props}
                >
                    <View style={{marginRight: 10, marginBottom: 4}}>
                        <MaterialCommunityIcons name="send-circle-outline" size={34} color="black" />
                    </View>
                </Send>
            );
        } }
        renderInputToolbar={props=>{
            return(
              
            <InputToolbar  {...props} containerStyle={{backgroundColor:Colour.lightGray,height:46,borderRadius:20,marginRight:2,marginLeft:2,marginBottom:5}}>
            </InputToolbar>  
            
            )
          }}
      />
    
    </SafeAreaView>
  
  )
  
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { backgroundColor: '#ffffff', flex: 1 },
  inputToolbarContainer:{flex:1, flexDirection:"row"},
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

})