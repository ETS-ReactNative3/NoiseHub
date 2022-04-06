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

// Functions
import * as spaceCalls from '../../API/spaceCalls';

export default function CheckInScreen({ navigation, route }) {
  const iconSize_1 = 48;
  const iconSize_2 = 30;
  const spaceID = route.params.spaceID;
  const spaceData = route.params.spaceData;
  const doorData = route.params.doorData;

  console.log("USERFEEDBACK: \n" + spaceData["userFeedback"]);

  const [spaceName, setName] = useState(spaceData['name']);
  
  // const headRange = spaceData['headRange'];
  // const curr_correction = spaceData['correction'];
  let userFeedbackJSON = JSON.parse(spaceData["userFeedback"]);

  if (userFeedbackJSON == "null") {
    userFeedbackJSON = []
  }

  console.log("USERFEEDBACKJSON: \n" + userFeedbackJSON);

  const [radio1, setRadio1] = useState({button1: false, button2: false, button3: false});
  const [radio1SelectedButton, setRadio1SelectedButton] = useState();

  function setRadio(button) {
    if (button == 1) {
      setRadio1({
        button1: true,
        button2: false,
        button3: false,
      });
      setRadio1SelectedButton('low');
    }
    else if (button == 2) {
      setRadio1({
        button1: false,
        button2: true,
        button3: false,
      });
      setRadio1SelectedButton('med');
    }
    else if (button == 3) {
      setRadio1({
        button1: false,
        button2: false,
        button3: true,
      });
      setRadio1SelectedButton('high');
    }
  };

  function submitFeedback() {
    // Current epoch time
    const secondsSinceEpoch = Math.round(Date.now() / 1000);

    // Interval
    let staleLife = 20 * 60;

    let lowCount = 0;
    let medCount = 0;
    let highCount = 0;

    // Add new feedback
    userFeedbackJSON.push({"time": String(secondsSinceEpoch), "value": radio1SelectedButton});

    // User Feedback: Clean, Append, Send
    for (let i=0; i<userFeedbackJSON.length; i++) {
      if ((secondsSinceEpoch - userFeedbackJSON[i]["time"]) > staleLife) {
        console.log("OLD");
        userFeedbackJSON.splice(i,1); // Remove stale feedback
      }
      else {
        if (userFeedbackJSON[i]["value"] == "low") {
          lowCount++;
        }
        else if (userFeedbackJSON[i]["value"] == "med") {
          medCount++;
        }
        else if (userFeedbackJSON[i]["value"] == "high") {
          highCount++;
          console.log("HERE: " + highCount)
        }
      }
    }
    
    // Calculate correction
    let heads_ts = doorData[0]["head"];
    let maxHeads = spaceData["headRange"];
    let oldCorrection = spaceData['correction'];
    let estimatedHeads = ((lowCount*0.165 + medCount*0.5 + highCount*0.835) / userFeedbackJSON.length) * maxHeads;
    let newCorrection = parseInt(heads_ts - estimatedHeads);
    console.log(
      "Low Count: " + lowCount + "\n" +
      "Med Count: " + medCount + "\n" +
      "High Count: " + highCount + "\n" +
      "Userfeedback Length: " + userFeedbackJSON.length + "\n" +
      "TS Heads Value: " + heads_ts + "\n" +
      "Estimated Heads: " + estimatedHeads + "\n" +
      "Max Heads: " + maxHeads + "\n" +
      "Old Correction: " + oldCorrection + "\n" +
      "New Correction: " + newCorrection + "\n"
    )
    
    console.log("NEW CORRECTION: " + newCorrection);
    // Update data in dynamo
    spaceCalls.update_space({
      uuid: spaceData.uuid,
      name: spaceData.name,
      location: spaceData.location,
      hours: spaceData.hours,
      amenities: spaceData.amenities,
      noiseLevel: spaceData.noiseLevel,
      busyLevel: spaceData.busyLevel,
      tempLevel: spaceData.tempLevel,
      userFeedback: JSON.stringify(userFeedbackJSON),
      graphData: spaceData.graphData,
      correction: newCorrection,
      headRange: spaceData.headRange
    });

    spaceCalls.get_space('113').then((response) => {
      // navigation.goBack();
      // navigation.navigate('Space');
      spaceCalls.get_space('113').then((response) => navigation.navigate('Space', {spaceID: spaceID, spaceData: response}))
    })
  }

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
            onPress={() => submitFeedback()}
          />
        </View>
      </View>
  </BlankScreen>
  );
}