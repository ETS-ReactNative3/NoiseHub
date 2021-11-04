import React from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';

import colors from '../config/colors';
import AppText from './AppText';

function AppButton({title, onPress, color = "primaryYellow"}) {
    return (
        <TouchableOpacity style={[styles.button, {backgroundColor: colors[color]}]} onPress={onPress}>
            <AppText style={styles.text}>{title}</AppText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primaryYellow,
        borderRadius: 25,
        justifyContent: 'center',
        alignSelf: 'center',
        padding: 15,
        width: '80%',
        marginVertical: 10,
    },
    text: {
        color: colors.primaryBlue,
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center'
    }
})

export default AppButton;