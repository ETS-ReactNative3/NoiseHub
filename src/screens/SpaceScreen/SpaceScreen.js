import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import React, { useState, useEffect, Component } from "react";
import { TextInput, View, TouchableOpacity, Text, Button, ScrollView, Dimensions } from "react-native";
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

// Graphing
import { LineChart } from "react-native-chart-kit";

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
  const spaceData = route.params.spaceData;
  const noiseData = route.params.noiseData;
  const doorData = route.params.doorData;

  console.log(spaceData);

  const [spaceName, setName] = useState(spaceData["name"]);
  const [spaceLocation, setLocation] = useState(spaceData["location"]);
  const [spaceHours, setHours] = useState("24/7");
  const [spaceAmenities, setAmenities] = useState(spaceData["amenities"]);
  const [noiseLevel, setNoise] = useState(noiseData[0].noise);
  const [busyLevel, setBusy] = useState(doorData[0].head);
  const [tempLevel, setTemp] = useState(doorData[0].head);
  const [userFeedback, setFeedback] = useState(spaceData["userFeedback"]);

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
      <View>
        <Text>Bezier Line Chart</Text>
        <LineChart
          data={{
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100
                ]
              }
            ]
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
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