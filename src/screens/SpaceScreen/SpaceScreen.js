import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import React, { useState, useEffect, Component } from "react";
import { TextInput, View, TouchableOpacity, Text, Button, ScrollView } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// Regular Icons
import {
  faArrowAltCircleLeft as farArrowAltCircleLeft, 
  faCheckCircle as farCheckCircle
} from '@fortawesome/free-regular-svg-icons'

// Solid Icons
import {
  faArrowAltCircleLeft as fasArrowAltCircleLeft, 
  faCheckCircle as fasCheckCircle 
} from '@fortawesome/free-solid-svg-icons'

import styles from "./styles";
import colors from '../../config/colors';


import { Auth } from 'aws-amplify'

// Functions
import * as spaceCalls from '../../API/spaceCalls';

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';

export default function SpaceScreen({ navigation, route }) {
  const iconSize = 24;
  // const spaceID = route.params.spaceID;
  const spaceID = 'uuid'
  const [spaceName, setName] = useState("");
  const [spaceLocation, setLocation] = useState("");
  const [spaceHours, setHours] = useState("");
  const [spaceAmenities, setAmenities] = useState("");
  const [noiseLevel, setNoise] = useState("");
  const [busyLevel, setBusy] = useState("");
  const [tempLevel, setTemp] = useState("");
  const [userFeedback, setFeedback] = useState("");

  async function setSpace() {
    // const response = await Auth.signIn("Test126", "Testing123!");

    const response = await spaceCalls.get_space(spaceID);
    console.log(response);
    setName(response["name"]);
    setLocation(response["location"]);
    setHours(response["hours"]);
    setAmenities(response["amenities"]);
    setNoise(response["noiseLevel"]);
    setBusy(response["busyLevel"]);
    setTemp(response["setTemp"]);
    setFeedback(response["userFeedback"]);

    // Auth.currentAuthenticatedUser({
    //   bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    // }).then(async user => {
    //   console.log(user.username);
    // });
  }
  
  // Get Space Data
  // setSpace();

  return (
  <BlankScreen style={styles.container}>
    <ScrollView style={styles.buttonsContainer}>
      <Text>{spaceName}</Text>
      <Text>{spaceLocation}</Text>
      <Text>{spaceHours}</Text>
      <Text>{spaceAmenities}</Text>
      <Text>{noiseLevel}</Text>
      <Text>{busyLevel}</Text>
      <Text>{tempLevel}</Text>
      <FontAwesomeIcon color={colors.primaryWhite} size={iconSize} icon={fasArrowAltCircleLeft} />
      <FontAwesomeIcon color={colors.primaryWhite} size={iconSize} icon={fasCheckCircle} />
      <FontAwesomeIcon color={colors.primaryWhite} size={iconSize} icon={farArrowAltCircleLeft} />
      <FontAwesomeIcon color={colors.primaryWhite} size={iconSize} icon={farCheckCircle} />
    </ScrollView>
  </BlankScreen>
  );
}