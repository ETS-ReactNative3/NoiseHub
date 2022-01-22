import { StyleSheet } from "react-native";
import colors from '../../config/colors'
export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: colors.primaryBlue
  },
  inputContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: '2.5%',
    backgroundColor: colors.primaryWhite,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: '2.5%',
    marginTop: '12.5%',
  },
  textInput: {
    color: colors.secondaryBlue,
    fontSize: 22,
    width: '85%'
  },
  textContainer: {
    flexDirection: 'row',
    paddingBottom: '10%',
    width: '85%',
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    width: 348,
    // height: 68,
    color: '#ffffff',
    // fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'center',
    // lineHeight: 36,
  }
});
