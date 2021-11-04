import React from 'react';

import {StyleSheet, TextInput, View} from 'react-native';

import defaultStyles from '../config/styles';

import {MaterialCommunityIcons} from '@expo/vector-icons'

function AppTextInput({icon, width = "80%", ...otherProps}) {
  return (
      <View style={styles.container}>
        <View style = {[styles.inputContainer, {width}]}>
          {icon && <MaterialCommunityIcons name={icon} size={20} color={defaultStyles.colors.medium} style={styles.icon}/> }
          <TextInput 
            placeholderTextColor={defaultStyles.colors.medium}
            style = {defaultStyles.text} {...otherProps}/>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    marginVertical: 2
  },  
  inputContainer: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10
  },
})

export default AppTextInput;