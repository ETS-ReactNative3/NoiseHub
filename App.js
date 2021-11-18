import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  ForgotPasswordScreen,
  ConfirmScreen,
  SurveyScreen1,
  SurveyScreen2,
} from "./src/screens";

import 'react-native-get-random-values'
import "react-native-url-polyfill/auto";

import Amplify from "aws-amplify";
import config from "./src/aws-exports";
Amplify.configure(config);

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen name="Confirm" component={ConfirmScreen} />
        <Stack.Screen name="SurveyScreen1" component={SurveyScreen1} />
        <Stack.Screen name="SurveyScreen2" component={SurveyScreen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
