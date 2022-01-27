import React, { useState } from "react";
import { View, TextInput } from 'react-native';
import styles from "./styles";

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';
import TextInput_1 from '../../components/TextInput_1';
import Logo_1 from '../../components/Logo_1';
import Button_2 from '../../components/Button_2';

// Functions
import * as userCalls from '../../API/userCalls';

// Configurations
import colors from '../../config/colors';

import { Auth } from 'aws-amplify'

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
      try {
          const response = await Auth.signIn(username, password);
          // response["username"] is also a method of retreiving the username

          Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
          }).then(async user => {
            // Check if user has completed survey
            const response = await userCalls.get_user(user.username);
            console.log(response);
            if (response == null) 
              navigation.navigate('Survey1');
            else
              navigation.navigate('Home');
          });
      } catch (error) {
          console.log('Error signing in - ', error);
      }
  }

  return (
    <BlankScreen style={styles.container}>
      <View style={styles.inputsContainer}>
        <Logo_1></Logo_1>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Username'
            style={styles.textInput}
            onChangeText = {(input) => setUsername(input.toLowerCase())}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Password'
            style={styles.textInput}
            onChangeText = {(input) => setPassword(input)}
          />
        </View>
      </View>
      <Button_2
            title='Forgot your Password?' 
            onPress={() => navigation.navigate('ForgotPassword1')}
      />
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Sign In' 
            onPress={() => signIn()}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Create Account' 
            onPress={() => navigation.navigate('Registration')}
          />
        </View>
      </View>
    </BlankScreen>
  );
}
