import { Alert } from "react-native";

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const createOneButtonAlert = () => {
  Alert.alert(
    "Unavailable",
    "Golly gee, you're a fast one! This space is still a work in progress, pardon us.",
    [{ text: "OK", onPress: () => console.log("OK Pressed") }]
  );
}