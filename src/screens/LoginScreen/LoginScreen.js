import React, { useState } from "react";
import { View } from 'react-native';
import styles from "./styles";


// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';
import TextInput_1 from '../../components/TextInput_1';

// Configurations
import colors from '../../config/colors';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <BlankScreen style={styles.container}>
      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <TextInput_1
            placeholder='Username'
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput_1
            placeholder='Password'
          />
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Sign In' 
              onPress={() => console.log('BUTTON_1 PRESSED')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Create Account' 
              onPress={() => console.log('BUTTON_1 PRESSED')}
          />
        </View>
      </View>
    </BlankScreen>
  );
}
