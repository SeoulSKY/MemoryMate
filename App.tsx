import { StatusBar } from "expo-status-bar";
import {StyleSheet, Text, View} from "react-native";

export default function App () {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>Your GEMINI AI Token: {process.env.EXPO_PUBLIC_GEMINI_TOKEN}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }
});
