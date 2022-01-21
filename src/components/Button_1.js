import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '../config/colors';

export default function Button_1({ title, onPress, buttonColor = 'secondaryBlue' }) {
	return (
		// <View style={styles.buttonContainer}>
			<TouchableOpacity style={[ styles.button, { backgroundColor: colors[buttonColor] } ]} onPress={onPress}>
				<Text style={styles.text}>{title}</Text>
			</TouchableOpacity>
		// </View>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.secondaryBlue,
		borderRadius: 48,
		//Sizing
		paddingVertical: 16,
		width: '65%',
	},
	text: {
		color: colors.primaryWhite,
		// fontSize: 22,
		// fontFamily: 'Roboto',
		fontSize: 22,
		fontWeight: '400',
		fontStyle: 'normal',
		textAlign: 'center',
		// letterSpacing: 'normal',
		// lineHeight: 24
	}
});
