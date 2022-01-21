import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '../config/colors';

export default function Button_1() {
	return (
	    <View style={styles.textContainer}>
            <Text style={styles.text}>NoiseHub</Text>
        </View>
	);
}

const styles = StyleSheet.create({
    textContainer: {
        flexDirection: 'row',
        width: '85%',
        alignSelf: 'center',
        marginBottom: '12%',
    },
	text: {
		color: colors.tertiaryBlue,
		fontSize: 64,
		fontWeight: '700',
		fontStyle: 'italic',
	}
});
