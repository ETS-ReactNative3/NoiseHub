import { Row } from "@aws-sdk/client-timestream-query";
import { StyleSheet } from "react-native";
import colors from '../../config/colors'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBlue,
    // alignSelf: 'center',
  },
  topRow: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
    marginTop: '2%',
  },
  name: {
    flex: 1,
    color: colors.tertiaryBlue,
    fontStyle: 'italic',
    fontWeight: '700',
    fontSize: 40,
    textAlign: 'center',
    // marginHorizontal: '2%',
    marginRight: '13.25%',
  },
  icon: {
    flex: 1,
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
    width: 348,
    // height: 68,
    color: '#ffffff',
    // fontFamily: 'Roboto',
    fontSize: 40,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'center',
    lineHeight: 36,
  },
  radioContainer: {
    // flex: 1,
    fontSize: 50,
    color: colors.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // marginBottom: '100%',
  },
  radio: {
    width: '100%',
  },
  radioButtonActive: {
    backgroundColor: colors.secondaryBlue,
    width: 140,
    height: 60,
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    borderRadius: 10,
    marginBottom: 25,
  },
  radioButtonInactive: {
    backgroundColor: colors.primaryWhite,
    width: 140,
    height: 60,
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    borderRadius: 10,
    marginBottom: 25,
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
    // fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: '400',
    fontStyle: 'normal',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 5,
  },
  radio1: {
    marginVertical: '5%',
    justifyContent: 'flex-start',
    // marginBottom: '65%',
  },
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    // marginVertical: '2.5%',
    // marginBottom: '50%',
  },
  buttonsContainer: {
    flex: 1,
    // flexDirection: 'row'
      marginBottom: '60%',
    // paddingBottom: '50%',
    // margin
  }
});
