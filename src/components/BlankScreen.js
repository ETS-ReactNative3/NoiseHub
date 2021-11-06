import React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';

export default function Screen({ children, style }) {
	return (
		<SafeAreaView style={[ styles.screen, style ]}>
			<StatusBar barStyle={'default'} />
			<View style={[ styles.view, style ]}>{children}</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		paddingTop: Constants.statusBarHeight,
		flex: 1
	},
	view: {
		flex: 1
	}
});

// Resources
// Constants.statusBarHeight - https://docs.expo.dev/versions/latest/sdk/constants/#constantsstatusbarheight
