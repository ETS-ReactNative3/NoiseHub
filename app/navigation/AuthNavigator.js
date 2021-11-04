import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import LoginScreen from '../screens/Auth/LoginScreen';
import CreateAccountScreen from '../screens/Auth/CreateAccountScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/> 
    <Stack.Screen name="CreateAccount" component={CreateAccountScreen} options={{headerShown: false}}/>
  </Stack.Navigator>
);

export default AuthNavigator;