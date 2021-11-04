import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
// import { firebase } from "../../firebase/config";
// import * as Google from "expo-google-app-auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "374263006325-uetse2eogc2sf7fr85jamp12f9tb9nc8.apps.googleusercontent.com",
        iosClientId:
          "374263006325-8f779gve3nos6tlmnlmrt4tgf2rha6gv.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        navigation.navigate("Home");
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image
          style={styles.logo}
          source={require("../../../assets/icon.png")}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => signInWithGoogleAsync()}
        >
          <Text style={styles.buttonTitle}>Log in with Google</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
