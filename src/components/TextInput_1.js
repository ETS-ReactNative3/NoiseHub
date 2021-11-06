import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import colors from '../config/colors';

export default function TextInput_1({ placeholder, width}) {
	return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          style={styles.textInput}
        />
      </View>
    </View>
	);
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: colors.primaryWhite,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
	textInput: {
    color: colors.primaryPink,
    fontSize: 22,
    width: '85%'
	},
});
