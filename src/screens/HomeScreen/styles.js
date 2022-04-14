import { Row } from "@aws-sdk/client-timestream-query";
import { StyleSheet } from "react-native";
import { color } from "react-native-reanimated";
import colors from '../../config/colors'

export const search_iconSize = 32;

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
