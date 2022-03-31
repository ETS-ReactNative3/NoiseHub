import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import React, { useState, useEffect, Component } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Button,
  ScrollView,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// Regular Icons
import {
  faArrowAltCircleLeft as farArrowAltCircleLeft,
  faCheckCircle as farCheckCircle,
} from "@fortawesome/free-regular-svg-icons";

// Solid Icons
import {
  faArrowAltCircleLeft as fasArrowAltCircleLeft,
  faCheckCircle as fasCheckCircle,
  faThermometerHalf,
  faVolumeUp,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./styles";
import colors from "../../config/colors";

// Graphing
import { LineChart } from "react-native-chart-kit";

import { Auth } from "aws-amplify";

// Components
import BlankScreen from "../../components/BlankScreen";
import Button_1 from "../../components/Button_1";

function* yLabel() {
  yield* ["Low", "Med", "High"];
}

import * as timestreamCalls from "../../API/timestreamCalls";

let firstCall = true;

export default function SpaceScreen({ navigation, route }) {
  const iconSize_1 = 48;
  const iconSize_2 = 30;
  const spaceID = route.params.spaceID;
  const spaceData = route.params.spaceData;

  console.log("Space Screen!");

  const [headCount, setHeadCount] = useState();

  const [noiseData, setNoiseData] = useState([
    {
      noise: undefined,
      time: undefined,
    },
  ]);

  const [doorData, setDoorData] = useState([
    {
      head: undefined,
      temp: undefined,
      time: undefined,
    },
  ]);

  async function getData() {
    console.log("GET DATA");
    let data = await timestreamCalls.getTimeStreamData();
    setNoiseData(data["noise"]);
    setDoorData(data["door"]);
  }

  var dict = JSON.parse(spaceData.graphData);
  // console.log(dict.head_data);
  var noise_x = dict.noise_timestamp;
  var noise_y = dict.noise_data;
  var head_y_str = dict.head_data;
  var head_y = [];

  var audio_level = "";

  if (noise_y.slice(-1) == 0) {
    audio_level = "Low";
  } else if (noise_y.slice(-1) == 1) {
    audio_level = "Medium";
  } else {
    audio_level = "High";
  }

  for (var i = 0; i < head_y_str.length; i++)
    head_y.push(parseInt(head_y_str[i]));

  var temp_y_str = dict.temp_data;
  var temp_y = [];

  for (var i = 0; i < temp_y_str.length; i++)
    temp_y.push(parseFloat(temp_y_str[i]));

  const ts_heads = head_y.slice(-1);
  const correction = spaceData["correction"];
  const estimated_heads = ts_heads + correction;
  const maxHeads = spaceData["headRange"];
  
  if (firstCall) {
    console.log("First Call");
    getData();
    firstCall = false;

    if (estimated_heads < maxHeads*0.34) {
      setHeadCount("Low");
    }
    else if (estimated_heads < maxHeads * 0.67) {
      setHeadCount("Med");
    }
    else {
      setHeadCount("High");
    }
  }

  const [spaceName, setName] = useState(spaceData["name"]);
  const [spaceLocation, setLocation] = useState(spaceData["location"]);
  const [spaceHours, setHours] = useState("24/7");
  const [spaceAmenities, setAmenities] = useState(spaceData["amenities"]);
  const [noiseLevel, setNoise] = useState(noiseData[0].noise);
  const [busyLevel, setBusy] = useState(doorData[0].head);
  const [tempLevel, setTemp] = useState(doorData[0].head);
  const [userFeedback, setFeedback] = useState(spaceData["userFeedback"]);

  const yLabelIterator = yLabel();
  return (
    <BlankScreen style={styles.container}>
      <ScrollView>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={iconSize_1}
              icon={farArrowAltCircleLeft}
            />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.name}>
            {spaceName}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CheckIn", {
                spaceID: "113",
                spaceData: spaceData,
                doorData: doorData,
              })
            }
          >
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={iconSize_1}
              icon={farCheckCircle}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.dataBar}>
          <View style={styles.dataBarItem}>
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={iconSize_2}
              icon={faVolumeUp}
            />
            <Text style={styles.icon_text}>{audio_level}</Text>
          </View>
          <View style={styles.dataBarItem}>
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={iconSize_2}
              icon={faUsers}
            />
            <Text style={styles.icon_text}>{headCount}</Text>
          </View>
          <View style={styles.dataBarItem}>
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={iconSize_2}
              icon={faThermometerHalf}
            />
            <Text style={[styles.icon_text, styles.noise_icon_text]}>
              {temp_y.slice(-1)}
            </Text>
          </View>
        </View>
        <View>
          <Text numberOfLines={1} style={styles.title}>
            History
          </Text>
          <LineChart
            data={{
              labels: ["-24h", "-20h", "-16h", "-12h", "-8h", "-4h", "0h"],
              datasets: [
                {
                  data: noise_y,
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={190}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            formatYLabel={() => yLabelIterator.next().value}
            segments={2}
            chartConfig={{
              backgroundColor: "#0a5274",
              backgroundGradientFrom: "#0a5255",
              backgroundGradientTo: "#0a5274",
              decimalPlaces: 1, // optional, defaults to 2dp
              // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "0",
                strokeWidth: "0",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <LineChart
            data={{
              labels: ["-24h", "-20h", "-16h", "-12h", "-8h", "-4h", "0h"],
              datasets: [
                {
                  data: head_y,
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={190}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#0a5274",
              backgroundGradientFrom: "#0a5255",
              backgroundGradientTo: "#0a5274",
              decimalPlaces: 1, // optional, defaults to 2dp
              // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "0",
                strokeWidth: "0",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
          <LineChart
            data={{
              labels: ["-24h", "-20h", "-16h", "-12h", "-8h", "-4h", "0h"],
              datasets: [
                {
                  data: temp_y,
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={190}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#0a5274",
              backgroundGradientFrom: "#0a5255",
              backgroundGradientTo: "#0a5274",
              decimalPlaces: 1, // optional, defaults to 2dp
              // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "0",
                strokeWidth: "0",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
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
