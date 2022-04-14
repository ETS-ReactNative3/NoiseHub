import React, { useState } from "react";
import { TextInput, View, ScrollView, RefreshControl } from "react-native";

// Styling + Icons
import styles, { search_iconSize, placeholder_spaces } from "./styles";
import colors from "../../config/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// Components
import BlankScreen from "../../components/BlankScreen";
import SpaceCard from "../../components/SpaceCard";

// Amplify
import { Auth } from "aws-amplify";

// DynamoDB Scan Operation (For Search Functionality)
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

// Functions
import * as spaceCalls from "../../API/spaceCalls";
import * as timestreamCalls from "../../API/timestreamCalls";
import * as lambdaCalls from "../../API/lambdaCalls";
import * as helperFunctions from "../../API/helperFunctions";

// Global Variables
let firstCall = true;

export default function HomeScreen({ navigation }) {
  // Debug
  Auth.currentCredentials().then(async (credentials) => {
    if (credentials.authenticated != true) {
      const user = Auth.signIn("test126", "Testing123!");
      console.log("SIGNED IN");
    } else {
      // console.log(credentials);
      console.log("ALREADY SIGNED IN");
    }
  });


  const [refreshing, setRefreshing] = useState(false);

  const audio_value_map = {
    "0": "Low",
    "1": "Med",
    "2": "High"
  }

  const [stateData, setData] = useState({
    audio_level: undefined,
    temp_level: undefined,
    headCount: undefined,
  });

  const [search, setSearch] = useState();

  let timeout = null;
  function typeTime(input) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      spaceSearch(input);
    }, 1000); // 1000 represents milliseconds interval for user to stop typing before function executes
  }

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
    console.log("GET DATA in HOME SCREEN");
    let temp_data = {
      spaceData: undefined,
      audio_level: undefined,
      temp_level: undefined,
      headCount: undefined,
    };

    let ts_data = await timestreamCalls.getTimeStreamData();

    temp_data.audio_level = audio_value_map[ts_data["noise_temp"][0]["noise"]];
    
    // temp_data.temp_level = (ts_data["door"][0]["temp"] * 1.8 + 32).toFixed(1)
    temp_data.temp_level = (ts_data["noise_temp"][0]["temp"] * 1.8 + 32).toFixed(1)

    spaceCalls.get_space("113").then((response) => {
      temp_data.spaceData = response;
      var dict = JSON.parse(response.graphData);
      var noise_y = dict.noise_data;

      const ts_heads = parseInt(dict.head_data.slice(-1));
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
      setData(temp_data);
    });
  }

  if (firstCall) {
    firstCall = false;
    console.log("First Call");
    lambdaCalls.invokeLambda();
    helperFunctions.sleep(4000).then(() => {
      getData();
    });
  }

  return (
    <BlankScreen style={styles.container}>
      <ScrollView
        style={styles.buttonsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getData} />
        }
      >
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={(input) => typeTime(input.toLocaleLowerCase())}
          />
          <FontAwesomeIcon
            style={styles.searchIcon}
            color={colors.secondaryBlue}
            size={search_iconSize}
            icon={faSearch}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SpaceCard
            spaceName="PHO 113"
            noise={stateData.audio_level}
            head={stateData.headCount}
            temp={stateData.temp_level}
            onPress={() => {
              navigation.navigate("Space", {
                spaceID: "113",
                spaceData: stateData.spaceData,
              });
            }}
          />
        </View>
        <View>
          {placeholder_spaces.map((space, index) => {
            return (
              <View key = {index} style={styles.buttonContainer}>
                <SpaceCard
                  spaceName={space.spaceName}
                  noise={space.noise}
                  head={space.head}
                  temp={space.temp}
                  onPress={helperFunctions.createOneButtonAlert}
                />
              </View>
            )
          })}
        </View>
      </ScrollView>
    </BlankScreen>
  );
}
