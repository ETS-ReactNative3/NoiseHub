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
  },
  inputsContainer: {
    
  },
  buttonsContainer: {
    marginTop: '10%'
  },
  textContainer: {
    flexDirection: 'row',
    width: '85%',
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    width: 348,
    // height: 68,
    color: '#ffffff',
    fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'center',
    lineHeight: 36,
  },
  textInput: {
    color: colors.secondaryBlue,
    fontSize: 22,
    width: '85%'
  },
  radioContainer: {
    // flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    fontSize: 50,
    color: colors.secondaryBlue,
    // marginTop: 20,
  },
  radio: {
    flexDirection: 'row',
    width: '100%',
    // marginTop: 30,
  },
  radioButtonActive: {
    backgroundColor: colors.secondaryBlue,
    width: 140,
    height: 60,
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    borderRadius: 10,
  },
  radioButtonInactive: {
    backgroundColor: colors.primaryWhite,
    width: 140,
    height: 60,
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    borderRadius: 10,
  },
  radioButtonTextActive: {
    fontSize: 24,
    color: colors.primaryWhite,
    textAlign: 'center',
  },
  radioButtonTextInactive: {
    fontSize: 24,
    color: colors.secondaryBlue,
    textAlign: 'center',
  },
  radioTitle: {
    color: '#ffffff',
    fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 5,
  },
  radio1: {
    marginVertical: '5%',
  }
});
