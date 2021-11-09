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

  },
  textInput: {
    color: colors.primaryPink,
    fontSize: 22,
    width: '85%'
  }
});
