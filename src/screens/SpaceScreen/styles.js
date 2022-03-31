import { Row } from "@aws-sdk/client-timestream-query";
import { StyleSheet } from "react-native";
import colors from "../../config/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBlue,
  },
  buttonContainer: {
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: "22.5%",
    justifyContent: "space-between",
  },
  topRow: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    width: "90%",
    marginTop: "2%",
  },
  name: {
    flex: 1,
    color: colors.tertiaryBlue,
    fontStyle: "italic",
    fontWeight: "700",
    fontSize: 40,
    textAlign: "center",
    marginHorizontal: "2%",
  },
  icon: {
    flex: 1,
    flexDirection: "row",
  },
  dataBar: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    // alignItems: 'center',
    justifyContent: "center",
    width: "95%",
  },
  dataBarItem: {
    // alignSelf: 'center',
    marginVertical: "7.5%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  icon_text: {
    color: colors.primaryWhite,
    fontSize: 30,
    paddingLeft: "10%",
  },
  noise_icon_text: {
    color: colors.primaryWhite,
    fontSize: 30,
    paddingLeft: "4%",
  },
  texxt: {
    color: colors.primaryWhite,
    fontSize: 25,
  },
  title: {
    flex: 1,
    color: colors.primaryWhite,
    fontWeight: "500",
    fontSize: 30,
    textAlign: "center",
    marginHorizontal: "2%",
  },
});
