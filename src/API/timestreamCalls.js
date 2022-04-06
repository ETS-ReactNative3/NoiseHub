import React, { useState, useEffect, Component } from "react";
import { TimestreamQuery, QueryCommand } from "@aws-sdk/client-timestream-query";
import { Auth } from 'aws-amplify'
// Specified here - https://github.com/aws/aws-sdk-js-v3#getting-started - https://github.com/aws/aws-sdk-js-v3/issues/2288
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

// const [noiseData, setNoiseData] = useState([{
//   noise: undefined,
//   time: undefined
// }]);

// const [doorData, setDoorData] = useState([{
//   head: undefined,
//   temp: undefined,
//   time: undefined
// }]);

async function formatNoiseData(input) {
  let data = []
  for (let i=0; i<input['Rows'].length; i++) {
    let row = input['Rows'][i]['Data'];
    let obj = {
      noise: row[0]['ScalarValue'],
      time: row[2]['ScalarValue']
    }
    data.push(obj);
  }
  return data;
  setNoiseData(data);
}

async function formatDoorData(input) {
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
  return data;
  // setDoorData(data);
}

export const getTimeStreamData = async () => {
  let result = {};
  const region = "us-east-2";

  const credentials = await Auth.currentCredentials();

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
  const NoiseQueryString = `SELECT * FROM "${DatabaseName}"."${NoiseTable}" ORDER BY time DESC LIMIT 1`;
  const DoorQueryString = `SELECT * FROM "${DatabaseName}"."${Doortable}" ORDER BY time DESC LIMIT 1`;
  // const QueryString = `SELECT * FROM "${DatabaseName}"."${TableName}" ORDER BY time DESC LIMIT 1000000000000000000`;
  // const QueryString = `SELECT * FROM "${DatabaseName}"."${TableName}" WHERE time between ago(15m) and now() ORDER BY time DESC LIMIT 10`;
  // console.log(await queryClient.query({ QueryString })); // Also a valid way to query
  const NoiseCommand = new QueryCommand({QueryString: NoiseQueryString})
  const DoorTableCommand = new QueryCommand({QueryString: DoorQueryString})

  const NoiseData_ts = await queryClient.send(NoiseCommand);  
  const DoorData_ts = await queryClient.send(DoorTableCommand);

  const noiseData = await formatNoiseData(NoiseData_ts);
  const doorData = await formatDoorData(DoorData_ts);

  return {noise: noiseData, door: doorData};
}