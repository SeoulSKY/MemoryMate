import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity,
} from "react-native";
import Response from "../components/response";
import Message from "../components/message";

const ChatScreen = () => {
  const [inputText, setInputText] = useState("");
  const [listData, setListData] = useState<string[]>([]);

  const searchInput = () => {
    setListData((prevList) => [...prevList, inputText]);
    setInputText("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Image source={require("../assets/icons/robot.png")} style={styles.icon} />
        <Text style={{ fontSize: 20, fontWeight: "400", color: "#323232" }}>Ben</Text>
      </View>
      <FlatList
        style={{ paddingHorizontal: 16, marginBottom: 80 }}
        data={listData}
        renderItem={({ item }) => (
          <View>
            <Message message={item} />
            <Response prompt={item} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Speak with Ben"
          style={styles.input}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          selectionColor="#323232"
        />
        <TouchableOpacity onPress={searchInput}>
          <Image source={require("../assets/icons/right-arrow.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingTop: 36,
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
    paddingHorizontal: 32,
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
});

export default ChatScreen;