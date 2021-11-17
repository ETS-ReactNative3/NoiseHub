import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import React, { useState, useEffect, Component } from "react";
import { TextInput, View, TouchableOpacity, Text, Button } from "react-native";
import styles from "./styles";
import AWS from "aws-sdk/dist/aws-sdk-react-native";

export default function HomeScreen({ navigation }) {
  var params = {
    QueryString:
      "SELECT * FROM 'noisehub-timestream'.'sensordata'" /* required */,
    ClientToken: "",
    MaxRows: "",
    NextToken: "",
  };

  var timestreamquery = new AWS.TimestreamQuery({
    credentials: creds,
    region: "us-east-2",
  });

  timestreamquery.query(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });

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
