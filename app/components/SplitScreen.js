import React from 'react';
import Constants from "expo-constants";
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

import colors from '../config/colors';

function Screen({children, style}) {
  return (
    <View style={styles.top}>
      <StatusBar barStyle={'light-content'}/>
      <SafeAreaView style={[styles.top, style]}>
        <View style={[styles.view, style]}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      
    },
    top: {
        flex: 0.25,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: colors.primaryBlue
    },
    view: {
        flex: 1,
    }
})

export default Screen;