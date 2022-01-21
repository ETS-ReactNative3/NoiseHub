import React, { useState } from "react";
import { View, Text, TextInput } from 'react-native';
import styles from "./styles";

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';

// Configurations
import colors from '../../config/colors';

import { Auth } from 'aws-amplify'

export default function ForgotPasswordScreen1({ navigation }) {
  const [username, setUsername] = useState("");

  async function forgotPassword() {
    try {
      const response = await Auth.forgotPassword(username).then(data => {
        console.log(data);
        navigation.navigate('ForgotPassword2', { user: username });
      }).catch(err => console.log(err));
    } catch (error) {
      console.log('Error forgetting passoword - ', error);
    }
  }

  return (
    <BlankScreen style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Enter the username associated with your account to receive a password reset confirmation code.</Text>
      </View>
      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder='Username'
            style={styles.textInput}
            onChangeText = {(input) => setUsername(input)}
          />
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Send Code' 
            onPress={() => forgotPassword()}
          />
        </View>
      </View>
    </BlankScreen>
  );
}
