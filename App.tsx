import {SafeAreaProvider} from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Quiz from "./src/screens/Quiz";
import Result from "./src/screens/Result";
import SignUp from "./src/screens/SignUp";
import Home from "./src/screens/Home";
import Chat from "./src/screens/Chat";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  const [hideSplashScreen] = React.useState(true);

  const [fontsLoaded, error] = useFonts({
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "GothicA1-Light": require("./assets/fonts/GothicA1-Light.ttf"),
    "GothicA1-Regular": require("./assets/fonts/GothicA1-Regular.ttf"),
    "GothicA1-Bold": require("./assets/fonts/GothicA1-Bold.ttf"),
    "GothicA1-ExtraBold": require("./assets/fonts/GothicA1-ExtraBold.ttf"),
    "IBMPlexSans-Bold": require("./assets/fonts/IBMPlexSans-Bold.ttf"),
    "NanumGothicExtraBold": require("./assets/fonts/NanumGothicExtraBold.ttf"),
    "Nunito-Black": require("./assets/fonts/Nunito-Black.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {hideSplashScreen ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Quiz"
              component={Quiz}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Result"
              component={Result}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        ) : null}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
