import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Amplify from '@aws-amplify/cli';
import awsmobile from './src/aws-exports';
Amplify.configure(awsmobile);

import LoginScreen from './app/screens/Auth/LoginScreen';

import AuthNavigator from './app/navigation/AuthNavigator';
// import { render } from 'react-dom';

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
