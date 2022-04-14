import { Row } from "@aws-sdk/client-timestream-query";
import { StyleSheet } from "react-native";
import { color } from "react-native-reanimated";
import colors from '../../config/colors'

export const search_iconSize = 32;

export const placeholder_spaces = [
  {
    spaceName: "Ingalls",
    noise: "Med",
    head: "High",
    temp: "72.8"
  },
  {
    spaceName: "Bat Cave",
    noise: "Low",
    head: "Low",
    temp: "64.1"
  },
  {
    spaceName: "EPIC Workshop",
    noise: "High",
    head: "Med",
    temp: "77.4"
  },
  {
    spaceName: "Tavern in the Square",
    noise: "High",
    head: "High",
    temp: "74.9"
  },
  {
    spaceName: "Fitrec Recreation Pool",
    noise: "Med",
    head: "Low",
    temp: "75.6"
  }
]

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBlue
  },
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    // marginVertical: '2.5%',
    marginBottom: '22.5%',
  },
  searchBarContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: '2.5%',
    backgroundColor: colors.primaryWhite,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    // marg
    width: '95%',
  },
  searchBar: {
    // color: colors.primaryWhite,
    fontSize: 22,
    color: colors.primaryBlue,
    // width: '80%'
    // width: '100%',
  }, 
  searchIcon: {
    flex: 1,
    flexDirection:'row',
    alignSelf: 'center',
    position: 'absolute',
    right: 15,
  }
});
