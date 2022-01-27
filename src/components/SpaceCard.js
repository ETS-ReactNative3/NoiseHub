import React from 'react';
import { StyleSheet, Text, Icon, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faThermometerHalf, faVolumeUp, faUsers } from '@fortawesome/free-solid-svg-icons'

import colors from '../config/colors';

const iconSize = 32;

export default function SpaceCard({ spaceName, onPress, data, backgroundColor = 'secondaryBlue' }) {
	return (
        <TouchableOpacity style={[ styles.card, { backgroundColor: colors[backgroundColor] } ]} onPress={onPress}>
            <View style={styles.textContainer}>
                <View>
                    <Text style={styles.spaceName}>{spaceName}</Text>
                </View>
                <View style={styles.spaceHours}>
                    <Text style={styles.spaceHours}>9AM-6PM</Text>
                </View>
                <View style={styles.bottomRow}>
                    {/* <View style={styles.spaceNoise}> */}
                        <FontAwesomeIcon color={colors.primaryWhite} size={iconSize} icon={faVolumeUp} />
                        <Text style={styles.text}>Low</Text>
                        <FontAwesomeIcon color={colors.primaryWhite} size={iconSize} icon={faUsers} />
                        <Text style={styles.text}>50%</Text>
                        <FontAwesomeIcon color={colors.primaryWhite} size={iconSize} icon={faThermometerHalf} />
                        <Text style={styles.text, styles.thermo}>68ºF</Text>
                    {/* </View> */}
                </View>
            </View>
        </TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
        flex: 1,
        marginHorizontal: '2.5%',
        marginVertical: '0.5%',
        flexDirection: 'row',
		backgroundColor: colors.secondaryBlue,
		borderRadius: 10,
        height: '250%',
        // width: '95%',
	},
    textContainer: {
        // flexDirection: 'row',
        flex: 1,
        marginVertical: '5.75%',
        // height: '250%',
        width: '50%'
    },
	text: {
        paddingHorizontal: 12,
		color: colors.primaryWhite,
		fontSize: 26,
		fontWeight: '400',
		fontStyle: 'normal',
	},
    spaceName: {
        color: colors.primaryWhite,
        fontSize: 26,
        fontWeight: '400',
        fontStyle: 'normal',
        position: 'absolute',
        left: '3%',
    },
    spaceHours: {
        position: 'absolute',
        right: '3%',
        color: colors.primaryWhite,
        fontSize: 26,
        fontWeight: '400',
        fontStyle: 'normal',
    },
    bottomRow: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: '3%',
    },
    thermo: {
        paddingHorizontal: 4,
		color: colors.primaryWhite,
		fontSize: 26,
		fontWeight: '400',
		fontStyle: 'normal',
    }
});
