import React, { useState } from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import styles from "./styles";

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';

export default function LoginScreen({ navigation, route }) {
  // SurveryScreen1 Values
  const userSchool = route.params.school;
  // Current Screen Values
  const [userNoise, setNoise] = useState();
  const [userTemp, setTemp] = useState();
  const [userCrowd, setCrowd] = useState();

  // Radio Buttons Logic
  const [button1, setButton1] = useState(false);
  const [button2, setButton2] = useState(false);

  async function setRadioButton1() {
    setButton1(true);
    setButton2(false);
  }
  async function setRadioButton2() {
    setButton1(false);
    setButton2(true);
  }

  school_list = [
    'Boston University',
    'Northeastern University',
    'Northeastefsdfasdfsadfasdfadsrn University',
    'Boston College',
  ]

  return (
    <BlankScreen style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>What do you consider when finding a place to study?</Text>
      </View>
      <View style={styles.radioContainer}>
        {/* It's confusing, but when I turn radio into a component make sense */}
        <View style={styles.radio1}> 
          <Text style={styles.radioTitle}>Noise</Text>
          <View style={styles.radio}>
            <TouchableOpacity style={button1 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={setRadioButton1}>
              <Text style={button1 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={button2 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={setRadioButton2}>
              <Text style={button2 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.radio1}> 
          <Text style={styles.radioTitle}>Temperature</Text>
          <View style={styles.radio}>
            <TouchableOpacity style={button1 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={setRadioButton1}>
              <Text style={button1 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={button2 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={setRadioButton2}>
              <Text style={button2 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.radio1}> 
          <Text style={styles.radioTitle}>Crowdedness</Text>
          <View style={styles.radio}>
            <TouchableOpacity style={button1 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={setRadioButton1}>
              <Text style={button1 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={button2 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={setRadioButton2}>
              <Text style={button2 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Next' 
            onPress={() => navigation.navigat('SurveyScreen2', {school: userSchool})}
          />
        </View>
      </View>
    </BlankScreen>
  );
}
