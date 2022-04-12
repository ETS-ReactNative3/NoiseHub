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
  RefreshControl,
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
  faBolt,
  faDesktop,
  faEye,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./styles";
import colors from "../../config/colors";

// Graphing
import { LineChart } from "react-native-chart-kit";

import { Auth } from "aws-amplify";

// Components
import BlankScreen from "../../components/BlankScreen";
import Button_1 from "../../components/Button_1";
import Chart_Noise from "../../components/Chart_Noise"
import Chart_Head from "../../components/Chart_Head"
import Chart_Temp from "../../components/Chart_Temp"

function* yLabel() {
  yield* ["Low", "Med", "High"];
}

import * as timestreamCalls from "../../API/timestreamCalls";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import * as spaceCalls from "../../API/spaceCalls";

let firstCall = true;

export default function SpaceScreen({ navigation, route }) {
  const iconSize_1 = 48;
  const iconSize_2 = 30;
  const spaceID = route.params.spaceID;

  const audio_value_map = {
    0: "Low",
    1: "Med",
    2: "High",
  };

  console.log("Space Screen!");

  const [refreshing, setRefreshing] = useState(false);

  const temp_spaceData = route.params.spaceData;

  var dict = JSON.parse(temp_spaceData.graphData);
  var noise_x = dict.noise_timestamp;
  var noise_y = dict.noise_data;
  var head_y_str = dict.head_data;
  var head_y = [];
  var head_x = dict.head_timestamp;

  // Peak values
  var max_loud = dict.max_loud_value;
  var max_temp = dict.max_temp_value;

  const [stateData, setData] = useState({
    noiseData: {
      noise: undefined,
      time: undefined,
    },
    doorData: {
      head: undefined,
      temp: undefined,
      time: undefined,
    },
    audio_level: undefined,
    temp_level: undefined,
    headCount: undefined,
    max_head: dict.max_head_value,
    headY: dict.head_data,
    spaceData: temp_spaceData,
  });

  async function getData() {
    console.log("GET DATA in SPACE SCREEN");
    let temp_data = {
      doorData: {
        head: undefined,
        temp: undefined,
        time: undefined,
      },
      audio_level: undefined,
      temp_level: undefined,
      headCount: undefined,
      max_head: dict.max_head_value,
      headY: [0, 0, 0, 0, 0, 0, 0],
      spaceData: undefined,
    };
    let ts_data = await timestreamCalls.getTimeStreamData();
    temp_data.doorData = ts_data["door"];

    temp_data.audio_level = audio_value_map[ts_data["noise"][0]["noise"]];

    temp_data.temp_level = (ts_data["door"][0]["temp"] * 1.8 + 32).toFixed(1);

    spaceCalls.get_space("113").then((response) => {
      temp_data.spaceData = response;
      const ts_heads = ts_data["door"][0]["head"];
      const correction = response["correction"];
      const estimated_heads = ts_heads - correction;
      const maxHeads = response["headRange"];

      if (estimated_heads < maxHeads * 0.34) {
        temp_data.headCount = "Low";
      } else if (estimated_heads < maxHeads * 0.67) {
        temp_data.headCount = "Med";
      } else {
        temp_data.headCount = "High";
      }

      for (var i = head_y.length - 1; i >= 800; i--) {
        // if (Math.sign(correction) == 1) {
        //   if (temp_data.max_head == head_y[i]) {
        //     temp_data.max_head -= correction;
        //   }
        // } else if (Math.sign(correction) == -1) {
        //   if (temp_data.max_head == head_y[i]) {
        //     temp_data.max_head = head_y[i] - correction;
        //     break;
        //   }
        //   if (head_y[i] > temp_data.max_head) {
        //     temp_data.max_head = head_y[i];
        //   }
        // }
        head_y[i] -= correction;

        // console.log(head_y.length);
        // console.log("running");
      }
      temp_data.max_head = Math.max(...head_y);
      temp_data.headY = head_y;
      // console.log(temp_data.max_head);
      setData(temp_data);
      // console.log(stateData);
    });
  }

  // Peak value timestamps

  var max_loud_timestamp = parseInt(dict.max_loud_timestamp.slice(11, -13)) - 4;
  var max_loud_minutes = dict.max_loud_timestamp.slice(14, 16);
  if (max_loud_timestamp == 12) {
    max_loud_timestamp =
      max_loud_timestamp.toString() + ":" + max_loud_minutes + "pm";
  } else if (max_loud_timestamp == 0) {
    max_loud_timestamp += 12;
    max_loud_timestamp =
      max_loud_timestamp.toString() + ":" + max_loud_minutes + "am";
  } else if (max_loud_timestamp > 12 && max_loud_timestamp < 24) {
    max_loud_timestamp -= 12;
    max_loud_timestamp =
      max_loud_timestamp.toString() + ":" + max_loud_minutes + "pm";
  } else if (max_loud_timestamp < 0) {
    max_loud_timestamp += 12;
    max_loud_timestamp =
      max_loud_timestamp.toString() + ":" + max_loud_minutes + "pm";
  } else {
    max_loud_timestamp =
      max_loud_timestamp.toString() + ":" + max_loud_minutes + "am";
  }

  for (var i = 0; i < head_y_str.length; i++)
    head_y.push(parseInt(head_y_str[i]));
  // console.log(`max_head: ${stateData.max_head}`);
  var new_max_head_timestamp_index = stateData.headY.indexOf(
    stateData.max_head
  );
  // console.log(new_max_head_timestamp_index);
  // console.log(head_x[new_max_head_timestamp_index]);
  // if (new_max_head_timestamp_index == -1) {
  //   var max_head_timestamp = parseInt(head_x[0].slice(11, -13)) - 4;
  // } else {
  var max_head_timestamp =
    parseInt(head_x[new_max_head_timestamp_index].slice(11, -13)) - 4;
  // }
  // var max_head_timestamp = parseInt(dict.max_head_timestamp.slice(11, -13)) - 4;
  var max_head_minutes = head_x[new_max_head_timestamp_index].slice(14, 16);

  if (max_head_timestamp == 12) {
    max_head_timestamp =
      max_head_timestamp.toString() + ":" + max_head_minutes + "pm";
  } else if (max_head_timestamp == 0) {
    max_head_timestamp += 12;
    max_head_timestamp =
      max_head_timestamp.toString() + ":" + max_head_minutes + "am";
  } else if (max_head_timestamp > 12 && max_head_timestamp < 24) {
    max_head_timestamp -= 12;
    max_head_timestamp =
      max_head_timestamp.toString() + ":" + max_head_minutes + "pm";
  } else if (max_head_timestamp < 0) {
    max_head_timestamp += 12;
    max_head_timestamp =
      max_head_timestamp.toString() + ":" + max_head_minutes + "pm";
  } else {
    max_head_timestamp =
      max_head_timestamp.toString() + ":" + max_head_minutes + "am";
  }

  var max_temp_timestamp = parseInt(dict.max_temp_timestamp.slice(11, -13)) - 4;
  var max_temp_minutes = dict.max_temp_timestamp.slice(14, 16);

  if (max_temp_timestamp == 12) {
    max_temp_timestamp =
      max_temp_timestamp.toString() + ":" + max_temp_minutes + "pm";
  } else if (max_temp_timestamp == 0) {
    max_temp_timestamp += 12;
    max_temp_timestamp =
      max_temp_timestamp.toString() + ":" + max_temp_minutes + "am";
  } else if (max_temp_timestamp > 12 && max_temp_timestamp < 24) {
    max_temp_timestamp -= 12;
    max_temp_timestamp =
      max_temp_timestamp.toString() + ":" + max_temp_minutes + "pm";
  } else if (max_temp_timestamp < 0) {
    max_temp_timestamp += 12;
    max_temp_timestamp =
      max_temp_timestamp.toString() + ":" + max_temp_minutes + "pm";
  } else {
    max_temp_timestamp =
      max_temp_timestamp.toString() + ":" + max_temp_minutes + "am";
  }

  var last_time = parseInt(noise_x.slice(-1)[0].slice(11, -13)) - 4;
  // console.log("LAST TIME IS", last_time);
  var x_label = [];
  for (var i = 0; i < 9; i++) {
    if (last_time == 12) {
      x_label.unshift(last_time.toString() + "pm");
    } else if (last_time == 0) {
      x_label.unshift((last_time + 12).toString() + "am");
    } else if (last_time > 12 && last_time < 24) {
      x_label.unshift((last_time - 12).toString() + "pm");
    } else if (last_time < 0) {
      x_label.unshift((last_time + 12).toString() + "pm");
    } else {
      x_label.unshift(last_time.toString() + "am");
    }

    last_time -= 3;
    if (last_time < 0) {
      last_time += 24;
    }
  }
  // console.log(x_label);
  // const [headY, setHeadY] = useState([0, 0, 0, 0, 0, 0, 0]);

  // var audio_level = "";

  // if (noise_y.slice(-1) == 0) {
  //   audio_level = "Low";
  // } else if (noise_y.slice(-1) == 1) {
  //   audio_level = "Medium";
  // } else {
  //   audio_level = "High";
  // }

  var temp_y_str = dict.temp_data;
  var temp_y = [];

  for (var i = 0; i < temp_y_str.length; i++)
    temp_y.push(parseFloat(temp_y_str[i]));

  const ts_heads = head_y.slice(-1);
  const correction = stateData.spaceData["correction"];
  const estimated_heads = ts_heads + correction;
  const maxHeads = stateData.spaceData["headRange"];

  if (firstCall) {
    firstCall = false;
    console.log("First Call");
    getData();
  }

  const yLabelIterator = yLabel();

  // Peak value data arrays for graphing
  const peak_noise = Array(noise_y.length).fill(2);
  // console.log(stateData.max_head);
  const peak_head = Array(stateData.headY.length).fill(stateData.max_head);
  // console.log(peak_head);
  // const peak_head = Array(stateData.headY.length).fill(16);
  const peak_temp = Array(temp_y.length).fill(max_temp);
  return (
    <BlankScreen style={styles.container}>
      <ScrollView
        style={styles.buttonsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getData} />
        }
      >
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => {
              firstCall = true;
              navigation.navigate("Home");
            }}
          >
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={iconSize_1}
              icon={farArrowAltCircleLeft}
            />
          </TouchableOpacity>
          <Text numberOfLines={1} style={styles.name}>
            {stateData.spaceData["name"]}
          </Text>
          <TouchableOpacity
            onPress={() => {
              firstCall = true;
              navigation.navigate("CheckIn", {
                spaceID: "113",
                spaceData: stateData.spaceData,
                doorData: stateData.doorData,
              });
            }}
          >
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={iconSize_1}
              icon={farCheckCircle}
            />
          </TouchableOpacity>
        </View>
        <Text numberOfLines={1} style={styles.title}>
          Current Data
        </Text>
        <View style={styles.dataBar}>
          <View style={styles.dataBarItem}>
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={iconSize_2}
              icon={faVolumeUp}
            />
            <Text style={styles.icon_text}>{stateData.audio_level}</Text>
          </View>
          <View style={styles.dataBarItem}>
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={iconSize_2}
              icon={faUsers}
            />
            <Text style={styles.icon_text}>{stateData.headCount}</Text>
          </View>
          <View style={styles.dataBarItem}>
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={iconSize_2}
              icon={faThermometerHalf}
            />
            <Text style={[styles.icon_text, styles.noise_icon_text]}>
              {stateData.temp_level}°
            </Text>
          </View>
        </View>
        <View>
          <Text numberOfLines={1} style={styles.texxt}>
            Noise
          </Text>
          <Chart_Noise 
            x_label={x_label}
            peak_noise={peak_noise}
            noise_y={noise_y}
            max_loud_timestamp={max_loud_timestamp}
          />
          <Text numberOfLines={1} style={styles.texxt}>
            Occupancy
          </Text>
          <Chart_Head
            x_label={x_label}
            peak_head={peak_head}
            headY={stateData.headY}
            max_head_timestamp={max_head_timestamp}
          />
          <Text numberOfLines={1} style={styles.texxt}>
            Temperature
          </Text>
          <Chart_Temp
            x_label={x_label}
            peak_temp={peak_temp}
            temp_y={temp_y}
            max_temp_timestamp={max_temp_timestamp}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={30}
              icon={faClock}
            />
            <Text style={styles.texxt}>{stateData.spaceData["hours"]}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <FontAwesomeIcon
              style={styles.icon2}
              color={colors.primaryWhite}
              size={30}
              icon={faBolt}
            />
            <Text style={styles.texxt}>Solder Station</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={30}
              icon={faDesktop}
            />
            <Text style={styles.texxt}>Monitors</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <FontAwesomeIcon
              style={styles.icon}
              color={colors.primaryWhite}
              size={30}
              icon={faEye}
            />
            <Text style={styles.texxt}>Eye Wash</Text>
          </View>
        </View>
      </ScrollView>
    </BlankScreen>
  );
}
