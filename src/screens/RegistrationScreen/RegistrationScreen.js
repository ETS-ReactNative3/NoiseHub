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
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
      try {
          const { user } = await Auth.signUp({
              username,
              password,
              attributes: {
                  email,
              }
          });
          console.log(user);
          // this.props.navigation.navigate('Confirm')
          navigation.navigate('Confirm', {user: username, pass: password}); // Navigate to next screen
      } catch (error) {
          console.log(username);
          console.log(password);
          console.log(email);
          console.log('Error signing up - ', error);
      }
  } 

  return (
    <BlankScreen style={styles.container}>
      <View style={styles.inputsContainer}>
      <View style={styles.inputContainer}>
          <TextInput
            placeholder='Email'
            style={styles.textInput}
            onChangeText = {(input) => setEmail(input)}
          />
        </View>
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
            title='Create Account' 
              onPress={() => signUp()}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Return to Login' 
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </BlankScreen>
  );
}
