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

export const timestamp_calc = (max_timestamp, max_minutes) => {
  console.log("Time Stamp Calculation");
  if (max_timestamp == 12) {
    max_timestamp = max_timestamp.toString() + ":" + max_minutes + "pm";
  } else if (max_timestamp == 0) {
    max_timestamp += 12;
    max_timestamp = max_timestamp.toString() + ":" + max_minutes + "am";
  } else if (max_timestamp > 12 && max_timestamp < 24) {
    max_timestamp -= 12;
    max_timestamp = max_timestamp.toString() + ":" + max_minutes + "pm";
  } else if (max_timestamp < 0) {
    max_timestamp += 12;
    max_timestamp = max_timestamp.toString() + ":" + max_minutes + "pm";
  } else {
    max_timestamp = max_timestamp.toString() + ":" + max_minutes + "am";
  }
  return max_timestamp;
}