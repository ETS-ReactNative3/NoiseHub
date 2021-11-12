import React, { useState } from "react";
import { View, TextInput } from 'react-native';
import styles from "./styles";

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';
import TextInput_1 from '../../components/TextInput_1';

// Configurations
import colors from '../../config/colors';

import { Auth } from 'aws-amplify'

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
      try {
          const user = await Auth.signIn(username, password);
          global.username = username;
          navigation.navigate('SurveyScreen1')
      } catch (error) {
          console.log('Error signing in - ', error);
      }
  } 

  return (
    <BlankScreen style={styles.container}>
      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Username'
            style={styles.textInput}
            onChangeText = {(input) => setUsername(input)}
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
