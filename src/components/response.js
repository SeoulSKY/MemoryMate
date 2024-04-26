import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-native-markdown-display";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
const ImagePicker = require("react-native-image-picker");



const date = new Date();
//const API_KEY = ;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function Response(props) {
	const [generatedText, setGeneratedText] = useState("");
	
	useEffect(() => {
		const fetchData = async () => {
			const model = genAI.getGenerativeModel({ model: "gemini-pro" });
			const prompt = props.prompt;
			const result = await model.generateContent(prompt);
			const response = await result.response;
			const text = await response.text();
			setGeneratedText(text);
		};
		fetchData();
	}, []);

	return (
		<View style={styles.response}>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
					<Image source={require("../../assets/profiles/male/50_0.png")} style={[styles.icon, styles.roundedImage]}  />
					<Text style={{ fontWeight: 600 }}>Ben</Text>
				</View>
				<Text style={{ fontSize: 10, fontWeight: "600" }}>
					{date.getHours()}:{date.getMinutes()}
				</Text>
			</View>
			<Markdown>{generatedText}</Markdown>
		</View>
	);
}

const styles = StyleSheet.create({
	response: {
		flexDirection: "column",
		gap: 8,
		backgroundColor: "#fafafa",
		marginBottom: 8,
		padding: 16,
		borderRadius: 16,
	},
	icon: {
		width: 28,
		height: 28,
	},
	roundedImage: {
		borderRadius: 50, 
	  },
});


// import React, { useState, useEffect } from "react";
// import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import Markdown from "react-native-markdown-display";
// import * as Speech from "expo-speech";

// const date = new Date();
// const API_KEY = "AIzaSyBIHtFrtiGYoRp6O9vE7oxUsT4VX013Cpg";
// const genAI = new GoogleGenerativeAI(API_KEY);

// export default function Response(props) {
//   const [generatedText, setGeneratedText] = useState("");
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//       const prompt = props.prompt;
//       const result = await model.generateContent(prompt);
//       const response = await result.response;
//       const text = await response.text();
//       setGeneratedText(text);
//     };
//     fetchData();
//   }, []);

//   const handleSpeech = () => {
//     if (isSpeaking) {
//       Speech.stop();
//       setIsSpeaking(false);
//     } else {
//       Speech.speak(generatedText);
//       setIsSpeaking(true);
//     }
//   };

//   return (
//     <View style={styles.response}>
//       {/* ... rest of your code */}
//       <TouchableOpacity onPress={handleSpeech}>
//         <Text>{isSpeaking ? "Stop Speaking" : "Speak Text"}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }