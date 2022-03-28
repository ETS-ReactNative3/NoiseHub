import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import React, { useState, useEffect, Component } from "react";
import { TextInput, View, TouchableOpacity, Text, Button, ScrollView } from "react-native";
import styles from "./styles";

import colors from '../../config/colors';

// Timestream Query
import { TimestreamQuery, QueryCommand } from "@aws-sdk/client-timestream-query";
import { Auth } from 'aws-amplify'
// Specified here - https://github.com/aws/aws-sdk-js-v3#getting-started - https://github.com/aws/aws-sdk-js-v3/issues/2288
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

// DynamoDB Scan
import { DynamoDB, DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';
import SpaceCard from "../../components/SpaceCard";

// Functions
import * as spaceCalls from '../../API/spaceCalls';

const iconSize = 32;

let firstCall = true;

export default function HomeScreen({ navigation }) {

  let timeout = null;

  function typeTime(input) {
    clearTimeout(timeout);
    timeout = setTimeout(function(){spaceSearch(input)},1000); // 1000 represents milliseconds interval for user to stop typing before function executes
  }

  Auth.currentCredentials().then(async credentials => {
    if (credentials.authenticated != true) {
      const user = Auth.signIn('test126', 'Testing123!');
      console.log("SIGNED IN");
    } else {
      // console.log(credentials);
      console.log("ALREADY SIGNED IN");
    }
  })

  const [search, setSearch] = useState();

  const [noiseData, setNoiseData] = useState([{
    noise: undefined,
    time: undefined
  }]);

  const [doorData, setDoorData] = useState([{
    head: undefined,
    temp: undefined,
    time: undefined
  }]);
  
  function spaceSearch(input) {
    console.log(input);

    Auth.currentCredentials().then(async credentials => {
      const client = await new DynamoDBClient({
        region: 'us-east-2', 
        credentials: credentials 
      })

      const params = {
        TableName: 'spaceTable',
        FilterExpression: 'begins_with(#name, :name)',
        // KeyConditionExpression: '#name = :name',
        ExpressionAttributeNames:{
          "#name": "name",
          "#NAME": "name"
        },
        ExpressionAttributeValues: {
          ":name": {"S": input},
        },
        ProjectionExpression: "#NAME" // name is a reserved keyword so I use an alias
      }

      const command = new ScanCommand(params);
      // client.send(command);
      client.send(command).then(response => console.log(response));
    })
  }

  function formatNoiseData(input) {
    let data = []
    for (let i=0; i<input['Rows'].length; i++) {
      let row = input['Rows'][i]['Data'];
      let obj = {
        noise: row[0]['ScalarValue'],
        time: row[2]['ScalarValue']
      }
      data.push(obj);
    }
    setNoiseData(data);
  }

  function formatDoorData(input) {
    let data = []
    for (let i=0; i<input['Rows'].length; i++) {
      let row = input['Rows'][i]['Data'];
      let obj = {
        head: row[0]['ScalarValue'].replace(/{|}/g, ''),
        temp: row[1]['ScalarValue'].replace(/{|}/g, ''),
        time: row[3]['ScalarValue']
      }
      data.push(obj);
    }
    setDoorData(data);
  }

  async function getData() {
    console.log("GET DATA");
    let result = [];
    const region = "us-east-2";

    Auth.currentCredentials().then(async credentials => {
      const endpointsQueryClient = new TimestreamQuery({ 
        region,
        credentials: credentials,
      });

      const qClientResponse = await endpointsQueryClient.describeEndpoints({});

      const queryClient = new TimestreamQuery({
        region,
        endpoint: `https://${qClientResponse.Endpoints[0].Address}`,
        credentials: credentials,
      });

      const DatabaseName = 'noisehub-timestream';
      const NoiseTable = 'noise_data';
      const Doortable = 'door_table'
      const NoiseQueryString = `SELECT * FROM "${DatabaseName}"."${NoiseTable}" ORDER BY time DESC LIMIT 3`;
      const DoorQueryString = `SELECT * FROM "${DatabaseName}"."${Doortable}" ORDER BY time DESC LIMIT 3`;
      // const QueryString = `SELECT * FROM "${DatabaseName}"."${TableName}" ORDER BY time DESC LIMIT 1000000000000000000`;
      // const QueryString = `SELECT * FROM "${DatabaseName}"."${TableName}" WHERE time between ago(15m) and now() ORDER BY time DESC LIMIT 10`;
      // console.log(await queryClient.query({ QueryString })); // Also a valid way to query
      const NoiseCommand = new QueryCommand({QueryString: NoiseQueryString})
      const DoorTableCommand = new QueryCommand({QueryString: DoorQueryString})

      const NoiseData = await queryClient.send(NoiseCommand);  
      const DoorData = await queryClient.send(DoorTableCommand);

      formatNoiseData(NoiseData);
      formatDoorData(DoorData);

      console.log(DoorData);
    });    
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
          onChangeText = {(input) => typeTime(input.toLocaleLowerCase())}
        />
        <FontAwesomeIcon style={styles.searchIcon} color={colors.secondaryBlue} size={iconSize} icon={faSearch} />
        </View>
        <View style={styles.buttonContainer}>
          <SpaceCard
            spaceName='PHO 113'
            noise={noiseData[0].noise}
            head={doorData[0].head}
            temp={doorData[0].temp}
            onPress={() => {
              spaceCalls.get_space('113').then((response) => navigation.navigate('Space', {spaceID: '113', spaceData: response, doorData: doorData, noiseData: noiseData}))
            }}
          />
        </View>
      </ScrollView>
    </BlankScreen>
  );
}