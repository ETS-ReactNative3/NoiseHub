import { NavigationContainer, useScrollToTop } from "@react-navigation/native";
import React, { useState, useEffect, Component } from "react";
import { TextInput, View, TouchableOpacity, Text, Button } from "react-native";
import styles from "./styles";

// import firebase from "firebase/app";
// import firestore from "firebase/firestore";

export default function HomeScreen({ navigation }) {
  const [numServings, setNumServings] = useState(1);
  const [totalCalories, setTotalCalories] = useState(0);
  const [foodData, setFoodData] = useState([]);

  const [recipeName, setRecipeName] = useState("");
  const [recipeArray, setRecipeArray] = useState([]);

  var foodArray = [];
  var totalCaloriesTemp = 0;

  // Firestore object
  // const db = firebase.firestore();

  const incrementServings = () => {
    setNumServings(numServings + 1);
    console.log("Servings: " + (numServings + 1));
  };

  const decrementServings = () => {
    setNumServings(numServings - 1);
    if (numServings <= 0) {
      setNumServings(0);
    }
    console.log("Servings: " + (numServings - 1));
  };

  const dbQuery = () => {
    console.log("running function");
    db.collection("Foods")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          foodArray.push(doc.id + " " + JSON.stringify(doc.data()));
          totalCaloriesTemp += doc.data().totalCals;
          setTotalCalories(totalCaloriesTemp);
        });
        setFoodData(foodArray);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const addRecipe = () => {
    setRecipeArray([
      ...recipeName,
      {
        id: recipeArray.length,
        value: recipeName,
      },
    ]);
  };

  const storeAndNavigate = (numServings) => {
    db.collection("DATA").doc("numServings").set({ numServings: numServings });
    navigation.navigate("Barcode");
  };

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
        Total Calories: {totalCalories}
      </Text>

      <Text style={{ fontSize: 30, marginBottom: 25, fontWeight: "bold" }}>
        Add a Food
      </Text>

      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontSize: 25, marginBottom: -10 }}>
          Number of Servings:{" "}
        </Text>
        <TouchableOpacity style={styles.button2} onPress={decrementServings}>
          <Text style={styles.buttonTitle}>-</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 30, marginBottom: -10 }}>{numServings}</Text>
        <TouchableOpacity style={styles.button2} onPress={incrementServings}>
          <Text style={styles.buttonTitle}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => storeAndNavigate(numServings)}
      >
        <Text style={styles.buttonTitle}>Add With Barcode</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => dbQuery()}>
        <Text style={styles.buttonTitle}>Display Recent Foods</Text>
      </TouchableOpacity>

      <Text>Recent Foods:</Text>
      <Text style={styles.DBtext}>{foodData}</Text>
    </View>
  );
}
