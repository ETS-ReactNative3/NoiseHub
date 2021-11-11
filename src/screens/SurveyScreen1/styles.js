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
    marginTop: '15%'
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
    color: colors.primaryPink,
    fontSize: 22,
    width: '85%'
  },
  dropdownContainer: {
    marginTop: 20,
    backgroundColor: colors.primaryWhite,
    borderRadius: 10,
  },
  dropdown: {
    width: '65%',
  },
  dropdownText: {
    color: colors.primaryPink,
    fontSize: 22,
    paddingHorizontal: 10,
    paddingVertical: 16,
    width: '100%',
    textAlign: 'center',
  },
  dropdownMenu: {
    flex: 1,
    flexDirection: 'row',
    width: '65%',
    backgroundColor: colors.primaryWhite,
    borderRadius: 10
  },
  dropdownMenuText: {
    color: colors.primaryBlue,
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 16,
    width: '95%',
    textAlign: 'center',
    alignSelf: 'center',
  },
  dropDownMenuTextSelected: {
    color: colors.primaryPink
  }
});
