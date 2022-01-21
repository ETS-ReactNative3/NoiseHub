import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '../config/colors';

export default function Button_1({ title, onPress }) {
	return (
		// <View style={styles.buttonContainer}>
			<TouchableOpacity style={[ styles.button ]} onPress={onPress}>
				<Text style={styles.text}>{title}</Text>
			</TouchableOpacity>
		// </View>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.primaryBlue,
		// borderRadius: 48,
		//Sizing
        paddingTop: 10,
		paddingBottom: 20,
		width: '65%',
	},
	text: {
		color: colors.tertiaryBlue,
		// fontSize: 22,
		// fontFamily: 'Roboto',
		fontSize: 18,
		fontWeight: '400',
		fontStyle: 'normal',
		textAlign: 'center',
	}
});