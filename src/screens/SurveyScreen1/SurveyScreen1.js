import React, { useState } from "react";
import { View, TextInput } from 'react-native';
import styles from "./styles";

// Components
import BlankScreen from '../../components/BlankScreen';
import Button_1 from '../../components/Button_1';

// Configurations
import colors from '../../config/colors';

import { Auth } from 'aws-amplify'

export default function LoginScreen({ navigation}) {
  return (
    <BlankScreen style={styles.container}>
    </BlankScreen>
  );
}
