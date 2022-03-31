import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import React, { useState, useEffect, Component } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  Button,
  ScrollView,
} from "react-native";
import styles from "./styles";

import colors from "../../config/colors";

// Timestream Query
import {
  TimestreamQuery,
  QueryCommand,
} from "@aws-sdk/client-timestream-query";
import { Auth } from "aws-amplify";
// Specified here - https://github.com/aws/aws-sdk-js-v3#getting-started - https://github.com/aws/aws-sdk-js-v3/issues/2288
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

// DynamoDB Scan
import {
  DynamoDB,
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// Components
import BlankScreen from "../../components/BlankScreen";
import Button_1 from "../../components/Button_1";
import SpaceCard from "../../components/SpaceCard";

// Functions
import * as spaceCalls from "../../API/spaceCalls";
import * as timestreamCalls from "../../API/timestreamCalls";

const iconSize = 32;

let firstCall = true;

export default function HomeScreen({ navigation }) {
  let timeout = null;

  function typeTime(input) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      spaceSearch(input);
    }, 1000); // 1000 represents milliseconds interval for user to stop typing before function executes
  }

  Auth.currentCredentials().then(async (credentials) => {
    if (credentials.authenticated != true) {
      const user = Auth.signIn("test126", "Testing123!");
      console.log("SIGNED IN");
    } else {
      // console.log(credentials);
      console.log("ALREADY SIGNED IN");
    }
  });

  const [search, setSearch] = useState();

  const [spaceData, setSpaceData] = useState();
  const [audio_level, set_audio_level] = useState();
  const [busy_level, set_busy_level] = useState();
  const [temp_level, set_temp_level] = useState();
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

  function spaceSearch(input) {
    console.log(input);

    Auth.currentCredentials().then(async (credentials) => {
      const client = await new DynamoDBClient({
        region: "us-east-2",
        credentials: credentials,
      });

      const params = {
        TableName: "spaceTable",
        FilterExpression: "begins_with(#name, :name)",
        // KeyConditionExpression: '#name = :name',
        ExpressionAttributeNames: {
          "#name": "name",
          "#NAME": "name",
        },
        ExpressionAttributeValues: {
          ":name": { S: input },
        },
        ProjectionExpression: "#NAME", // name is a reserved keyword so I use an alias
      };

      const command = new ScanCommand(params);
      // client.send(command);
      client.send(command).then((response) => console.log(response));
    });
  }

  async function getData() {
    console.log("GET DATA");
    spaceCalls.get_space("113").then((response) => {
      console.log(response);
      var dict = JSON.parse(response.graphData);
      var noise_y = dict.noise_data;

      if (noise_y.slice(-1) == 0) {
        set_audio_level("Low");
      } else if (noise_y.slice(-1) == 1) {
        set_audio_level("Medium");
      } else {
        set_audio_level("High");
      }
      // set_busy_level(parseInt(dict.head_data.slice(-1)));
      set_temp_level(dict.temp_data.slice(-1) + "°");
      setSpaceData(response);

      const ts_heads = parseInt(dict.head_data.slice(-1));
      const correction = response["correction"];
      const estimated_heads = ts_heads + correction;
      const maxHeads = response["headRange"];

      if (estimated_heads < maxHeads*0.34) {
        set_busy_level("Low");
      }
      else if (estimated_heads < maxHeads * 0.67) {
        set_busy_level("Med");
      }
      else {
        set_busy_level("High");
      }
    });
    let data = await timestreamCalls.getTimeStreamData();
    setNoiseData(data["noise"]);
    setDoorData(data["door"]);
  }

  if (firstCall) {
    console.log("First Call");
    getData();
    firstCall = false;
  }

  return (
    <BlankScreen style={styles.container}>
      <ScrollView style={styles.buttonsContainer}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={(input) => typeTime(input.toLocaleLowerCase())}
          />
          <FontAwesomeIcon
            style={styles.searchIcon}
            color={colors.secondaryBlue}
            size={iconSize}
            icon={faSearch}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SpaceCard
            spaceName="PHO 113"
            noise={audio_level}
            head={busy_level}
            temp={temp_level}
            onPress={() => {
              // spaceCalls
              //   .get_space("113")
              //   .then((response) =>
              //     navigation.navigate("Space", {
              //       spaceID: "113",
              //       spaceData: response,
              //     })
              //   );
              navigation.navigate("Space", {
                spaceID: "113",
                spaceData: spaceData,
              });
            }}
          />
        </View>
      </ScrollView>
    </BlankScreen>
  );
}
