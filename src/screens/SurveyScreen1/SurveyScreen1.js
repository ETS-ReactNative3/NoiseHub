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
  const [userSchool, setSchool] = useState("Select a School");

  school_list = [
    'Boston University',
    'Northeastern University',
    'Northeastefsdfasdfsadfasdfadsrn University',
    'Boston College',
  ]

  return (
    <BlankScreen style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Which College/University are you affiliated with?</Text>
      </View>
      <View style={styles.dropdownContainer}>
        <ModalDropdown 
          options={school_list}  
          defaultValue={userSchool}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropdownStyle={styles.dropdownMenu}
          dropdownTextStyle={styles.dropdownMenuText}
          dropdownTextHighlightStyle={styles.dropDownMenuTextSelected}
          showsVerticalScrollIndicator={true}
          onSelect = {(value) => setSchool(school_list[value])} // Value is the index
        ></ModalDropdown>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Next' 
            onPress={() => navigation.navigate('SurveyScreen2', {school: userSchool})}
          />
        </View>
      </View>
    </BlankScreen>
  );
}
