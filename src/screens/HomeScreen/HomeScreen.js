import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import React, { useState, useEffect, Component } from "react";
import { TextInput, View, TouchableOpacity, Text, Button } from "react-native";
import styles from "./styles";
// import AWS from "aws-sdk/dist/aws-sdk-react-native";

import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-timestream-query/index.html#getting-started
import { TimestreamQuery, QueryCommand } from "@aws-sdk/client-timestream-query";
// import { TimestreamWrite, TimestreamWriteClient, CreateDatabaseCommand } from "@aws-sdk/client-timestream-write";

import 'react-native-get-random-values';
import "react-native-url-polyfill/auto";
import { v4 as uuidv4 } from 'uuid';

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';

import { DataTable } from 'react-native-paper';



export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);

  async function getData() {
    let result = [];
    const region = "us-east-2";
    const endpointsQueryClient = new TimestreamQuery({ 
      region,
      credentials: {accessKeyId: "AKIATBZ4AXFK6BGWSUO4", secretAccessKey: "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"},
    });

    const qClientResponse = await endpointsQueryClient.describeEndpoints({});

    const queryClient = new TimestreamQuery({
      region,
      endpoint: `https://${qClientResponse.Endpoints[0].Address}`,
      credentials: {accessKeyId: "AKIATBZ4AXFK6BGWSUO4", secretAccessKey: "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"},
    });

    // Credentials via the CognitoIdentityPool is not working despite the Roles being given full-access to timestream (I also tried admin privs)
    // credentials: fromCognitoIdentityPool({
    //   client: new CognitoIdentityClient({ region }),
    //   // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
    //   identityPoolId: "us-east-2:470613db-8e4f-46dc-b929-4e5208ae8549",
    // }),

    const DatabaseName = 'noisehub-timestream';
    const TableName = 'sensordata';
    const QueryString = `SELECT * FROM "${DatabaseName}"."${TableName}" ORDER BY time DESC LIMIT 10`;
    // console.log(await queryClient.query({ QueryString })); // Also a valid way to query
    const command = new QueryCommand({QueryString: QueryString})
    const ts_data = await queryClient.send(command);

    for (let i=0; i<ts_data['Rows'].length; i++) {
      let cur_obj = ts_data['Rows'][i]["Data"];
      let temp = cur_obj[0]["ScalarValue"];
      let device_name = cur_obj[1]["ScalarValue"];
      let location = cur_obj[2]["ScalarValue"];
      let measure_name = cur_obj[3]["ScalarValue"];
      let time = cur_obj[4]["ScalarValue"];
      let measure_val_varchar = cur_obj[5]["ScalarValue"];
      let measure_val_double = cur_obj[6]["ScalarValue"];

      result.push({
        "temp": temp,
        "device_name": device_name,
        "location": location,
        "measure_name": measure_name,
        "time": time,
        "measure_val_varchar": measure_val_varchar,
        "measure_val_double": measure_val_double,
      })
    }
    setData(result);
    console.log(data);
  }

  // getData();
  // setData([{
  //   "device_name": "raspberry-pi-1",
  //   "location": "86 Linden St",
  //   "measure_name": "temperature",
  //   "measure_val_double": "69.35",
  //   "measure_val_varchar": undefined,
  //   "temp": "69.35",
  //   "time": "2021-11-16 20:56:57.650000"
  // }]);

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Location</DataTable.Title>
          <DataTable.Title numeric>Temperature</DataTable.Title>
          <DataTable.Title numeric>Time</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell>d</DataTable.Cell>
          <DataTable.Cell>d</DataTable.Cell>
          <DataTable.Cell numeric>d</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Bob</DataTable.Cell>
          <DataTable.Cell>test@test.com</DataTable.Cell>
          <DataTable.Cell numeric>105</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Mei</DataTable.Cell>
          <DataTable.Cell>mei@kindacode.com</DataTable.Cell>
          <DataTable.Cell numeric>23</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <Button_1
            title='Refresh Data' 
            onPress={() => getData()}
          />
        </View>
      </View>
    </View>
  );
}
