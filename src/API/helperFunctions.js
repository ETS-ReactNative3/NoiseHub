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

export const max_timestamp_calc = (dict_max_timestamp) => {
  let max_timestamp = parseInt(dict_max_timestamp.slice(11, -13)) - 4;
  let max_minutes = dict_max_timestamp.slice(14, 16);
  max_timestamp = timestamp_calc(max_timestamp, max_minutes);

  return(max_timestamp);
}

export const head_estimation = (data) => {
  let graphData = JSON.parse(data.graphData);
  let ts_heads = parseInt(graphData.head_data.slice(-1));
  let correction = data["correction"];
  let estimated_heads = ts_heads - correction;
  let maxHeads = data["headRange"];

  if (estimated_heads < maxHeads * 0.34) {
    return "Low";
  } else if (estimated_heads < maxHeads * 0.67) {
    return "Med";
  } else {
    return "High";
  }
}