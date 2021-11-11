import React, { useState } from "react";
import { View, Text } from 'react-native';
import styles from "./styles";

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';
import ModalDropdown from 'react-native-modal-dropdown'

// Configurations
import colors from '../../config/colors';

import { Auth } from 'aws-amplify'

export default function LoginScreen({ navigation }) {
  school_list = [
    'Boston University',
    'NorthEastern University',
    'Boston College'
  ]

  return (
    <BlankScreen style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Which College/University are you affiliated with?</Text>
      </View>
      <View style={styles.dropdownContainer}>
        <ModalDropdown 
          options={school_list}  
          defaultValue='Select a School'
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownMenu}
          dropdownTextStyle={styles.dropdownMenuText}
        ></ModalDropdown>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Next' 
            onPress={() => confirm()}
          />
        </View>
      </View>
    </BlankScreen>
  );
}
