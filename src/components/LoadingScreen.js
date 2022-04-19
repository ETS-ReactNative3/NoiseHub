import React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, Text, ActivityIndicator, View, SafeAreaView, StatusBar } from 'react-native';

import colors from '../config/colors';

import BlankScreen from "./BlankScreen";

export default function Screen({ children, style }) {
	return (
    <BlankScreen style={styles.container}>
      <ActivityIndicator
        size="large"
        color={colors.primaryWhite}
      />
    </BlankScreen>
	);
}

const styles = StyleSheet.create({
	screen: {
		paddingTop: Constants.statusBarHeight,
		flex: 1
	},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryBlue,
  },
	view: {
		flex: 1
	},
  text: {
      color: colors.primaryWhite,
      fontSize: 25,
  },
});

// Resources
// Constants.statusBarHeight - https://docs.expo.dev/versions/latest/sdk/constants/#constantsstatusbarheight
