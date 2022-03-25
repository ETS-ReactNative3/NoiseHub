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
  faCheckCircle as fasCheckCircle,
  faThermometerHalf,
  faVolumeUp,
  faUsers
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
  const iconSize_1 = 48;
  const iconSize_2 = 30;
  const spaceID = route.params.spaceID;
  const spaceData = route.params.data;

  const [spaceName, setName] = useState(spaceData[0].pho_113.location);
  const [spaceLocation, setLocation] = useState("");
  const [spaceHours, setHours] = useState("24/7");
  const [spaceAmenities, setAmenities] = useState("Solder Stations, Monitors, Eye Wash");
  const [noiseLevel, setNoise] = useState(spaceData[0].pho_113.noise);
  const [busyLevel, setBusy] = useState(spaceData[0].pho_113.heads);
  const [tempLevel, setTemp] = useState(spaceData[0].pho_113.temp);
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
    <ScrollView>
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
        >
          <FontAwesomeIcon style={styles.icon} color={colors.primaryWhite} size={iconSize_1} icon={farArrowAltCircleLeft} />
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.name}>{spaceName}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CheckIn', {spaceID: '113', data: spaceData})}
        >
          <FontAwesomeIcon style={styles.icon} color={colors.primaryWhite} size={iconSize_1} icon={farCheckCircle} />
        </TouchableOpacity>
      </View>
      <View style={styles.dataBar}>
        <View style={styles.dataBarItem}>
          <FontAwesomeIcon style={styles.icon} color={colors.primaryWhite} size={iconSize_2} icon={faVolumeUp} />
          <Text style={styles.icon_text}>{noiseLevel}</Text>
        </View>
        <View style={styles.dataBarItem}>
          <FontAwesomeIcon style={styles.icon} color={colors.primaryWhite} size={iconSize_2} icon={faUsers} />
          <Text style={styles.icon_text}>{busyLevel}</Text>
        </View>
        <View style={styles.dataBarItem}>
          <FontAwesomeIcon style={styles.icon} color={colors.primaryWhite} size={iconSize_2} icon={faThermometerHalf} />
          <Text style={styles.icon_text, styles.noise_icon_text}>{tempLevel}</Text>
        </View>
      </View>
      {/* <FontAwesomeIcon color={colors.primaryWhite} size={iconSize} icon={fasArrowAltCircleLeft} /> */}
      {/* <FontAwesomeIcon color={colors.primaryWhite} size={iconSize} icon={fasCheckCircle} /> */}
      {/* <Text style={styles.texxt}>{spaceName}</Text> */}
      {/* <Text style={styles.texxt}>{spaceLocation}</Text> */}
      <Text style={styles.texxt}>Hours: {spaceHours}</Text>
      <Text style={styles.texxt}>Amenities: {spaceAmenities}</Text>
    </ScrollView>
  </BlankScreen>
  );
}