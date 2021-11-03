import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Amplify from 'aws-amplify';
import awsmobile from './src/aws-exports';
Amplify.configure(awsmobile);

import Screen from './app/components/SplitScreen';
import AppTextInput from './app/components/AppTextInput';

import PlaceholderScreen from './app/screens/PlaceholderScreen';

import JoinIntroScreen from './app/screens/Onboarding/Intro/JoinIntroScreen';
import SignInScreen from './app/screens/Onboarding/Authentication/SignInScreen';
import RequestPassEmailScreen from './app/screens/Onboarding/Authentication/RequestPassEmailScreen';
import ResendPassEmailScreen from './app/screens/Onboarding/Authentication/ResendPassEmailScreen';
import ResetPassScreen from './app/screens/Onboarding/Authentication/ResetPassScreen';
import ValidResetScreen from './app/screens/Onboarding/Authentication/ValidResetScreen';
import VerifyAccountScreen from './app/screens/Onboarding/Authentication/VerifyAccountScreen';


import IntroNavigator from './app/navigation/IntroNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';
import { render } from 'react-dom';

export default class App extends React.Component {
  state = {
    isAuthenticated: false
  }

  authenticate(isAuthenticated)  {
    this.setState({ isAuthenticated });
  }

  render() {

    if (this.state.isAuthenticated){
      console.log('Auth: ', Auth)
      return (
        <PlaceholderScreen/>
      )
    }
    return (
       <NavigationContainer>
        <AuthNavigator
          screenProps={{
            authenticate: this.authenticate.bind(this)
          }}
        />
       </NavigationContainer>
  
    )
  }
}
