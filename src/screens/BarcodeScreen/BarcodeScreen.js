import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
// import firebase from "firebase/app";
// import { doc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCE8oIPSJf3PEE3V1Dr5vXeURK4fd3ausw",
//   authDomain: "sd-mini-project.firebaseapp.com",
//   projectId: "sd-mini-project",
//   storageBucket: "sd-mini-project.appspot.com",
//   messagingSenderId: "644920394140",
//   appId: "1:644920394140:web:8eec2d1a16d70419470859",
// };

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// Variable to store food name
let foodName = "";
// Variable to store number of servings
let numServings = 1;
// Variable to store whether food item is a part of a recipe
// let recipeBool = false;
// Variable to store food calories
let calories = "";
// Variable to store total calories
let totalCalories = "";
// Object to store Firestore document data
let docData = {};

export default function BarcodeScreen({ navigation }) {
  // export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  // HTTP request object
  const Http = new XMLHttpRequest();
  // Firestore object
  const db = firebase.firestore();

  var docRef = db.collection("DATA").doc("numServings");

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        numServings = doc.data().numServings;
        console.log("Document data:", numServings);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    // Parse off first character of data string (Barcode scanner appends an extra 0 for some reason - will continue to investigate if time permits)
    data = data.substring(1);

    // HTTP request to FDC API to retrieve food information
    const url =
      "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=xHd15jjwT1zhv7PRQ5foh0OeL4lWf1Yesjvy3TnS&query=" +
      data;
    Http.open("GET", url);

    Http.send();

    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4 && Http.status == 200) {
        const foodJSON = JSON.parse(Http.responseText);
        // console.log(foodJSON);

        console.log("FOOD:");
        foodName = foodJSON.foods[0].description;
        console.log(foodName);

        console.log("CALORIES PER SERVING:");
        calories = foodJSON.foods[0].foodNutrients[3].value;
        console.log(calories);

        console.log("NUM SERVINGS: " + numServings);

        console.log("TOTAL CALORIES:");
        totalCalories = calories * numServings;
        console.log(totalCalories);

        docData = {
          calsPerServing: calories,
          servings: numServings,
          totalCals: totalCalories,
          // recipeItem: recipeBool,
        };
        console.log(docData);

        // Store data in Firestore
        documentAdd(foodName, docData);
        storeAndNavigate(docData);
        // Redirect back to home screen
        navigation.navigate("Home");
      }
    };
  };

  const documentAdd = async () => {
    db.collection("Foods").doc(foodName).set(docData);
  };

  const storeAndNavigate = (docData) => {
    db.collection("Foods").doc("foodName").set(docData);
    navigation.navigate("Home");
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
