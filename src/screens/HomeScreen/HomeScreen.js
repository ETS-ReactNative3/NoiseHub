import React, { useState } from "react";
import { TextInput, View, ScrollView, RefreshControl } from "react-native";

// Styling + Icons
import styles, { search_iconSize } from "./styles";
import colors from "../../config/colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// Components
import BlankScreen from "../../components/BlankScreen";
import SpaceCard from "../../components/SpaceCard";
import LoadingScreen from "../../components/LoadingScreen"

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

  const [doneLoading, setLoading] = useState(false);

  const audio_value_map = {
    "0": "Low",
    "1": "Med",
    "2": "High"
  }

  const [stateData, setData] = useState([]);

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
      client.send(command).then((response) => console.log(response));
    });
  }

  async function getData() {
    console.log("GET DATA in HOME SCREEN");

    let spaces = []
    let placeholders = []

    let ts_data = await timestreamCalls.getTimeStreamData();

    spaceCalls.list_spaces().then((response) => {
      for (let i=0; i<response.length; i++) {
        let temp_data = {
          placeholder: undefined,
          id: undefined,
          name: undefined,
          noise: undefined,
          head: undefined,
          temp: undefined
        };

        temp_data.placeholder = response[i]["graphData"] == null ? true : false;
        temp_data.id = response[i]["uuid"];
        temp_data.name = response[i]["name"];

        // Placeholder dependent values
        if (response[i]["graphData"] == null) {
          temp_data.placeholder = true;
          temp_data.head = response[i]["busyLevel"];
          temp_data.noise = response[i]["noiseLevel"];
          temp_data.temp = response[i]["tempLevel"];
          placeholders.push(temp_data);
        } else {
          temp_data.placeholder = false;
          temp_data.head = helperFunctions.head_estimation(response[i]);
          temp_data.noise = audio_value_map[ts_data["noise_temp"][0]["noise"]];
          temp_data.temp = (ts_data["noise_temp"][0]["temp"] * 1.8 + 32).toFixed(1)
          spaces.push(temp_data);
        }
      }
      console.log(spaces);
      console.log(placeholders);
      stateData.push(...spaces);
      stateData.push(...placeholders);
      setData(stateData);
      helperFunctions.sleep(1000).then(() => {
        console.log(stateData);
        setLoading(true);
      });
      
    });

    // spaceCalls.get_space("113").then((response) => {
    //   temp_data.spaceData = response;

    //   temp_data.headCount = helperFunctions.head_estimation(response);
      
    //   setData(temp_data);

    //   setLoading(true);
    // });
  }

  if (firstCall) {
    firstCall = false;
    console.log("First Call");
    lambdaCalls.invokeLambda();
    helperFunctions.sleep(4000).then(() => {
      getData();
    });
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
          <View>
            {stateData.map((space, index) => {
              return (
                <View key = {index} style={styles.buttonContainer}>
                  <SpaceCard
                    spaceName={space.name}
                    noise={space.noise}
                    head={space.head}
                    temp={space.temp}
                    onPress={() => {space.placeholder ? 
                      helperFunctions.createOneButtonAlert() : 
                      navigation.navigate("Space", { spaceID: space.id })
                    }}
                  />
                </View>
              )
            })}
          </View>
        </ScrollView>
      </BlankScreen>
    );
  } else {
    return (
      <LoadingScreen/>
    );
  }

}
