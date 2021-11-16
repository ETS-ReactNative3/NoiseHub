import React, { useState } from "react";
import { View, TextInput } from 'react-native';
import styles from "./styles";

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';

// Configurations
import colors from '../../config/colors';

// API
import { createUser } from '../../graphql/mutations'

import { Auth } from 'aws-amplify'

export default function LoginScreen({ navigation, route }) {
  const [confirmationCode, setCode] = useState("");
  const username = route.params.user;
  const password = route.params.pass;

  async function signIn() {
      try {
          const user = await Auth.signIn(username, password);
          console.log('Signed in new user successfully');
      } catch (error) {
          console.log('Error signing in - ', error);
      }
  }

  async function confirm() {
      try {
          await Auth.confirmSignUp(username, confirmationCode);
          console.log('confirmed');
          signIn(); // Sign in with the new user
          navigation.navigate('SurveyScreen1');
      } catch (error) {
          console.log('error confirming sign up', error);
      }
  }

  return (
    <BlankScreen style={styles.container}>
      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Confirmation Code'
            style={styles.textInput}
            onChangeText = {(input) => setCode(input)}
          />
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Confirm' 
            onPress={() => confirm()}
          />
        </View>
      </View>
    </BlankScreen>
  );
}
