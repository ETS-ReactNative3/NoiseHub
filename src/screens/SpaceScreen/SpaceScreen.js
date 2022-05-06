import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// Styling
import styles from "./styles";
import colors from "../../config/colors";

// Regular Icons
import {
  faArrowAltCircleLeft as farArrowAltCircleLeft,
  faCheckCircle as farCheckCircle,
} from "@fortawesome/free-regular-svg-icons";

// Solid Icons
import {
  faThermometerHalf,
  faVolumeUp,
  faUsers,
  faBolt,
  faDesktop,
  faEye,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

// Components
import BlankScreen from "../../components/BlankScreen";
import Chart_Noise from "../../components/Chart_Noise";
import Chart_Head from "../../components/Chart_Head";
import Chart_Temp from "../../components/Chart_Temp";
import LoadingScreen from "../../components/LoadingScreen";

// Functions
import * as spaceCalls from "../../API/spaceCalls";
import * as timestreamCalls from "../../API/timestreamCalls";
import * as helperFunctions from "../../API/helperFunctions";

let firstCall = true;

export default function SpaceScreen({ navigation, route }) {
  const iconSize_1 = 48;
  const iconSize_2 = 30;
  const spaceID = route.params.spaceID;

  const [doneLoading, setLoading] = useState(false);

  const audio_value_map = {
    0: "Low",
    1: "Med",
    2: "High",
  };

  console.log("Space Screen!");

  const [refreshing, setRefreshing] = useState(false);

  const [stateData, setData] = useState();

  async function getData() {
    console.log("GET DATA in SPACE SCREEN");
    let temp_data = {
      name: undefined,
      hours: undefined,
      doorData: {
        head: undefined,
        temp: undefined,
        time: undefined,
      },
      audio_level: undefined,
      temp_level: undefined,
      headCount: undefined,
      headY: [0, 0, 0, 0, 0, 0, 0],
      noise_y: undefined,
      temp_y: undefined,
      max_loud_timestamp: undefined,
      max_head_timestamp: undefined,
      max_temp_timestamp: undefined,
      x_label: undefined,
      peak_noise: undefined,
      peak_head: undefined,
      peak_temp: undefined,
      spaceData: undefined,
    };

    let ts_data = await timestreamCalls.getTimeStreamData();
    console.log("HERE 1");
    temp_data.doorData = ts_data["door"];
    // console.log(temp_data.doorData);

    temp_data.audio_level = audio_value_map[ts_data["noise_temp"][0]["noise"]];

    temp_data.temp_level = (
      ts_data["noise_temp"][0]["temp"] * 1.8 +
      32
    ).toFixed(1);

    spaceCalls.get_space("113").then((response) => {
      console.log("HERE 1");
      temp_data.name = response["name"];
      temp_data.hours = response["hours"];
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

      // Peak Stuff
      var dict = JSON.parse(response.graphData);
      var noise_x = dict.noise_timestamp;
      var noise_y = dict.noise_data;
      var head_y_str = dict.head_data;
      var head_y = [];
      var temp_y_str = dict.temp_data;
      var temp_y = [];
      var head_x = dict.head_timestamp;
      var max_head = dict.max_head_value;
      console.log("MAX_HEAD: " + max_head);
      // temp_data.headY = dict.head_data;

      for (var i = 0; i < temp_y_str.length; i++) {
        temp_y.push(parseFloat(temp_y_str[i]));
      }

      for (var i = 0; i < head_y_str.length; i++) {
        head_y.push(parseInt(head_y_str[i]));
      }

      for (var i = head_y.length - 1; i >= 20; i--) {
        head_y[i] -= correction;
      }

      // Peak value timestamps
      temp_data.max_loud_timestamp = helperFunctions.max_timestamp_calc(
        dict.max_loud_timestamp
      );
      temp_data.max_head_timestamp = helperFunctions.max_timestamp_calc(
        head_x[dict.head_data.indexOf(max_head)]
      );
      temp_data.max_temp_timestamp = helperFunctions.max_timestamp_calc(
        dict.max_temp_timestamp
      );

      // Peak value timestamps
      //// Noise
      var max_loud_timestamp =
        parseInt(dict.max_loud_timestamp.slice(11, -13)) - 4;
      var max_loud_minutes = dict.max_loud_timestamp.slice(14, 16);
      temp_data.max_loud_timestamp = helperFunctions.timestamp_calc(
        max_loud_timestamp,
        max_loud_minutes
      );

      var new_max_head_timestamp_index = dict.head_data.indexOf(
        dict.max_head_value
      );
      var max_head_timestamp =
        parseInt(head_x[new_max_head_timestamp_index].slice(11, -13)) - 4;
      var max_head_minutes = head_x[new_max_head_timestamp_index].slice(14, 16);
      temp_data.max_head_timestamp = helperFunctions.timestamp_calc(
        max_head_timestamp,
        max_head_minutes
      );

      //// Temperature
      var max_temp_timestamp =
        parseInt(dict.max_temp_timestamp.slice(11, -13)) - 4;
      var max_temp_minutes = dict.max_temp_timestamp.slice(14, 16);
      temp_data.max_temp_timestamp = helperFunctions.timestamp_calc(
        max_temp_timestamp,
        max_temp_minutes
      );

      var last_time = parseInt(noise_x.slice(-1)[0].slice(11, -13)) - 4;
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
      temp_data.x_label = x_label;

      // Peak value data arrays for graphing
      temp_data.peak_noise = Array(noise_y.length).fill(2);
      temp_data.peak_head = Array(dict.head_data.length).fill(
        Math.max(...head_y)
      );
      temp_data.peak_temp = Array(temp_y.length).fill(dict.max_temp_value);

      temp_data.max_head = Math.max(...head_y);
      console.log("MAX_HEAD_2: " + temp_data.max_head)
      temp_data.headY = head_y;
      temp_data.temp_y = temp_y;
      temp_data.noise_y = noise_y;
      setData(temp_data);
      setLoading(true);
    });
  }

  if (firstCall) {
    firstCall = false;
    console.log("First Call");
    getData();
    // helperFunctions.sleep(5000).then((response) => {
    //   setLoading(true);
    // });
  }

  if (doneLoading) {
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
              {stateData.name}
            </Text>
            <TouchableOpacity
              onPress={() => {
                firstCall = true;
                navigation.navigate("CheckIn", {
                  spaceID: "113",
                  spaceData: stateData.spaceData,
                  doorData: stateData.max_head,
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
              x_label={stateData.x_label}
              peak_noise={stateData.peak_noise}
              noise_y={stateData.noise_y}
              max_loud_timestamp={stateData.max_loud_timestamp}
            />
            <Text numberOfLines={1} style={styles.texxt}>
              Occupancy
            </Text>
            <Chart_Head
              x_label={stateData.x_label}
              peak_head={stateData.peak_head}
              headY={stateData.headY}
              max_head_timestamp={stateData.max_head_timestamp}
            />
            <Text numberOfLines={1} style={styles.texxt}>
              Temperature
            </Text>
            <Chart_Temp
              x_label={stateData.x_label}
              peak_temp={stateData.peak_temp}
              temp_y={stateData.temp_y}
              max_temp_timestamp={stateData.max_temp_timestamp}
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
              <Text style={styles.texxt}>{stateData.hours}</Text>
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
  } else {
    return <LoadingScreen />;
  }
}
