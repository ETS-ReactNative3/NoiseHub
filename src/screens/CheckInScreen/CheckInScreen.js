import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import React, { useState, useEffect, Component } from "react";
import { TextInput, View, TouchableOpacity, Text, Button, ScrollView } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// Regular Icons
import {
  faArrowAltCircleLeft as farArrowAltCircleLeft, 
  faCheckCircle as farCheckCircle
} from '@fortawesome/free-regular-svg-icons'

import styles from "./styles";
import colors from '../../config/colors';

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';

export default function CheckInScreen({ navigation, route }) {
  const iconSize_1 = 48;
  const iconSize_2 = 30;
  const spaceID = route.params.spaceID;
  const spaceData = route.params.data;

  const [spaceName, setName] = useState(spaceData[0].pho_113.location);

  const [radio1, setRadio1] = useState({button1: false, button2: false, button3: false});

  function setRadio(button) {
    if (button == 1) {
      setRadio1({
        button1: true,
        button2: false,
        button3: false,
      })
    }
    else if (button == 2) {
      setRadio1({
        button1: false,
        button2: true,
        button3: false,
      })
    }
    else if (button == 3) {
      setRadio1({
        button1: false,
        button2: false,
        button3: true,
      })
    }
  };

  return (
  <BlankScreen style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
        >
          <FontAwesomeIcon style={styles.icon} color={colors.primaryWhite} size={iconSize_1} icon={farArrowAltCircleLeft} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.name}>{spaceName}</Text>
      </View>

      
      <View style={styles.textContainer}>
        <Text style={styles.text}>How busy is it?</Text>
      </View>
      <View style={styles.radioContainer}>
        {/* It's confusing, but when I turn radio into a component make sense */}
        <View style={styles.radio1}> 
          <View style={styles.radio}>
            {/* <Text style={styles.radioTitle}>How busy is it?</Text> */}
            <TouchableOpacity style={radio1.button1 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={() => setRadio(1)}>
              <Text style={radio1.button1 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>Low</Text>
            </TouchableOpacity>
            <TouchableOpacity style={radio1.button2 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={() => setRadio(2)}>
              <Text style={radio1.button2 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>Medium</Text>
            </TouchableOpacity>
            <TouchableOpacity style={radio1.button3 ? styles.radioButtonActive : styles.radioButtonInactive} onPress={() => setRadio(3)}>
              <Text style={radio1.button3 ? styles.radioButtonTextActive : styles.radioButtonTextInactive}>High</Text>
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