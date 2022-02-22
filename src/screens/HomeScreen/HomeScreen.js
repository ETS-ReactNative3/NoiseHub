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

const iconSize = 32;

export default function HomeScreen({ navigation }) {
  Auth.signIn('test126', 'Testing123!').then(response => console.log(response["username"]));
  
  const [data, setData] = useState([
  {
    "device_name": "",
    "location": "",
    "measure_name": "",
    "measure_val_double": "",
    "measure_val_varchar": "",
    "temp": "",
    "time": "",
    "dist": ""
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

  const [search, setSearch] = useState()

  async function getData() {
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
      const TableName = 'sensordata';
      // const QueryString = `SELECT * FROM "${DatabaseName}"."${TableName}" ORDER BY time DESC LIMIT 1000000000000000000`;
      // const QueryString = `SELECT * FROM "${DatabaseName}"."${TableName}" ORDER BY time DESC LIMIT 10`;
      // const QueryString = `SELECT * FROM "${DatabaseName}"."${TableName}" WHERE time between ago(15m) and now() ORDER BY time DESC LIMIT 10`;
      // console.log(await queryClient.query({ QueryString })); // Also a valid way to query
      const command = new QueryCommand({QueryString: QueryString})
      const ts_data = await queryClient.send(command);  

      for (let i=0; i<ts_data['Rows'].length; i++) {
        let cur_obj = ts_data['Rows'][i]["Data"];
        let temp = cur_obj[0]["ScalarValue"];
        let device_name = cur_obj[1]["ScalarValue"];
        let dist = cur_obj[2]["ScalarValue"];
        let location = cur_obj[3]["ScalarValue"];
        let measure_name = cur_obj[4]["ScalarValue"];
        let time = cur_obj[5]["ScalarValue"];
        let measure_val_varchar = cur_obj[6]["ScalarValue"];
        let measure_val_double = cur_obj[7]["ScalarValue"];
      
        result.push({
          "temp": temp,
          "device_name": device_name,
          "dist": dist,
          "location": location,
          "measure_name": measure_name,
          "time": time,
          "measure_val_varchar": measure_val_varchar,
          "measure_val_double": measure_val_double,
        })
      }
      setData(result);
    });    
  }
  
  return (
    <BlankScreen style={styles.container}>
      <ScrollView style={styles.buttonsContainer}>
        {/* <View style={styles.buttonContainer}>
          <Button_1
            title='Refresh Data' 
            onPress={() => getData()}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Refresh Data' 
            onPress={() => getData()}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Show Data in Console' 
            onPress={() => console.log(data)}
          />
        </View> */}
        <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          onChangeText = {(input) => spaceSearch(input.toLowerCase())}
        />
        <FontAwesomeIcon style={styles.searchIcon} color={colors.secondaryBlue} size={iconSize} icon={faSearch} />
        </View>
        <View style={styles.buttonContainer}>
          <SpaceCard
            spaceName='Space 1'
            onPress={() => navigation.navigate('Space', {spaceID: 'uuid'})}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SpaceCard
            spaceName='Space 2'
            onPress={() => console.log('Go to Space Screen')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SpaceCard
            spaceName='Space 3'
            onPress={() => console.log('Go to Space Screen')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SpaceCard
            spaceName='Space 4'
            onPress={() => console.log('Go to Space Screen')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SpaceCard
            spaceName='Space 5'
            onPress={() => console.log('Go to Space Screen')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SpaceCard
            spaceName='Space 6'
            onPress={() => console.log('Go to Space Screen')}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SpaceCard
            spaceName='Space 7'
            onPress={() => console.log('Go to Space Screen')}
          />
        </View>
      </ScrollView>
    </BlankScreen>
  );
}