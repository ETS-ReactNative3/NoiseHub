import React, { useState } from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import styles from "./styles";

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';

// API
import { createUser } from '../../graphql/mutations'
import { API, graphqlOperation } from 'aws-amplify';

export default function LoginScreen({ navigation, route }) {
  // SurveyScreen1 Values
  const userSchool = route.params.school;
  // Current Screen Values
  const [userNoise, setNoise] = useState();
  const [userTemp, setTemp] = useState();
  const [userCrowd, setCrowd] = useState();

  // Why not put all of these into one big array called radios? Because then it will reload every single radio when only one is updated
  const [radio1, setRadio1] = useState({button1: false, button2: false});
  const [radio2, setRadio2] = useState({button1: false, button2: false});
  const [radio3, setRadio3] = useState({button1: false, button2: false});

  async function setRadio(radio, button) {
    switch (radio) {
      case 1:
        setRadio1(button == 1 ? {button1: true, button2: false} : {button1: false, button2: true});
        setNoise(button == 1 ? true : false)
        break;
      case 2:
        setRadio2(button == 1 ? {button1: true, button2: false} : {button1: false, button2: true});
        setTemp(button == 1 ? true : false)
        break;
      case 3:
        setRadio3(button == 1 ? {button1: true, button2: false} : {button1: false, button2: true});
        setCrowd(button == 1 ? true : false)
        break;
      default:
        console.log('setRadio: Passed nonexistent radio input!')
    }
  }

  async function createUser() {
    try {
      const user = await API.graphql(graphqlOperation(createUser, { input: {
        username: username,
        school: userSchool,
        noisePref: userNoise,
        tempPref: userTemp,
        crowdPref: userCrowd
      }}))
    } catch(error) {
      console.log('Error creating User - ', error);
    }
  }

  async function onPressAction() {
    createUser();
    navigation.navigate('SurveyScreen2', {school: userSchool})
  }

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
            <TouchableOpacity style={radio1.button1 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={() => setRadio(1,1)}>
              <Text style={radio1.button1 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={radio1.button2 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={() => setRadio(1,2)}>
              <Text style={radio1.button2 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.radio1}> 
          <Text style={styles.radioTitle}>Temperature</Text>
          <View style={styles.radio}>
            <TouchableOpacity style={radio2.button1 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={() => setRadio(2,1)}>
              <Text style={radio2.button1 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={radio2.button2 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={() => setRadio(2,2)}>
              <Text style={radio2.button2 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.radio1}> 
          <Text style={styles.radioTitle}>Crowdedness</Text>
          <View style={styles.radio}>
            <TouchableOpacity style={radio3.button1 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={() => setRadio(3,1)}>
              <Text style={radio3.button1 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={radio3.button2 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={() => setRadio(3,2)}>
              <Text style={radio3.button2 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Next' 
            onPress={() => onPressAction()}
          />
        </View>
      </View>
    </BlankScreen>
  );
}
