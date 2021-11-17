import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import React, { useState, useEffect, Component } from "react";
import { TextInput, View, TouchableOpacity, Text, Button } from "react-native";
import styles from "./styles";
// import AWS from "aws-sdk/dist/aws-sdk-react-native";

import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-timestream-query/index.html#getting-started
import { TimestreamQueryClient, CancelQueryCommand, QueryCommand, DescribeEndpointsCommand } from "@aws-sdk/client-timestream-query";

import 'react-native-get-random-values';
import "react-native-url-polyfill/auto";
import { v4 as uuidv4 } from 'uuid';


// From sample code given for JS after creating Identity Pool 
// Initialize the Amazon Cognito credentials provider
// AWS.config.region = 'us-east-2'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-2:470613db-8e4f-46dc-b929-4e5208ae8549',
// });

const region = "us-east-2";
// const client = new S3Client({
//   region,
//   credentials: fromCognitoIdentityPool({
//     client: new CognitoIdentityClient({ region }),
//     // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
//     identityPoolId: "us-east-2:470613db-8e4f-46dc-b929-4e5208ae8549",
//   }),
// });

// https://aws.amazon.com/blogs/mobile/integrate-the-aws-sdk-for-javascript-into-a-react-app/
// AWS.config.update({
//   region: awsmobile.aws_cognito_region,
//   credentials: new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: awsmobile.aws_cognito_identity_pool_id
//   })
// });

const client = new TimestreamQueryClient({ 
  region: "us-east-2",
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    // Replace IDENTITY_POOL_ID with an appropriate Amazon Cognito Identity Pool ID for, such as 'us-east-1:xxxxxx-xxx-4103-9936-b52exxxxfd6'.
    identityPoolId: "us-east-2:470613db-8e4f-46dc-b929-4e5208ae8549",
  }),
});


// const regionalizedClient = new TimeStreamWriteClient({ region, endpoint: /**returned endpoint**/ });
// await regionalizedClient.send(new CreateDatabaseCommand(params));

// const command = new QueryCommand({QueryString: 'SELECT * FROM table'})
const command = new QueryCommand({QueryString: "SELECT * FROM 'noisehub-timestream'.'sensordata"})

async function f1() {
  try {
    const data = await client.send(command);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

f1();


export default function HomeScreen({ navigation }) {
  // var params = {
  //   QueryString:
  //     "SELECT * FROM 'noisehub-timestream'.'sensordata'" /* required */,
  //   ClientToken: "",
  //   MaxRows: "",
  //   NextToken: "",
  // };

  // var timestreamquery = new AWS.TimestreamQuery({
  //   credentials: creds,
  //   region: "us-east-2",
  // });

  // timestreamquery.query(params, function (err, data) {
  //   if (err) console.log(err, err.stack);
  //   // an error occurred
  //   else console.log(data); // successful response
  // });

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 30,
          marginTop: 50,
          marginBottom: 50,
          fontWeight: "bold",
        }}
      >
        Total Calories: 121247
      </Text>
    </View>
  );
}
