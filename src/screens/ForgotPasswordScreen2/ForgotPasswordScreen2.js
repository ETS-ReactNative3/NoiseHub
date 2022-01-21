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

export default function ForgotPasswordScreen2({ navigation, route }) {
  const [confirmationCode, setCode] = useState("");
  const [newPassword, setPassword] = useState("");
  const username = route.params.user;  

  async function resetPassword() {
      try {
          Auth.forgotPasswordSubmit(username, confirmationCode, newPassword).then(data => {
            console.log(data)
            navigation.navigate('Login');
          }).catch(err => console.log(err));
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
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='New Password'
            style={styles.textInput}
            onChangeText = {(input) => setPassword(input)}
          />
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Confirm' 
            onPress={() => resetPassword()}
          />
        </View>
      </View>
    </BlankScreen>
  );
}
