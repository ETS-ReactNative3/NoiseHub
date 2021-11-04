import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import * as Yup from 'yup';

import { Auth } from '@aws-amplify/cli';


import AppText from '../../../components/AppText';
import SplitScreen from '../../../components/SplitScreen';

import AppForm  from '../../../components/forms/AppForm';
import AppFormField  from '../../../components/forms/AppFormField';
import SubmitButton from '../../../components/forms/SubmitButton';

import colors from '../../../config/colors';

import routes from '../../../navigation/routes';

//import useAuth from '../auth/useAuth';


const validationSchema1 = Yup.object().shape({
  username: Yup.string().required("Please type in your username").min(4).label("Username"),
  email: Yup.string().required("Please type in your email").email().label("Email"),
  password: Yup.string().required("Please type in your password").min(4).label("Password"),
});

const validationSchema2 = Yup.object().shape({
  code: Yup.number().required("Please type in your verification code").label("Verification Code"),
});

function CreateAccountScreen( { navigation } ) {

  //const { logIn } = useAuth();

  //const [loginFailed, setLoginFailed] = useState(false);


  const handleSubmit = async ({ username, email, password }) => {
    const result = await Auth.signUp({
      username,
      password,
      attributes: {
        email
      },
    })
      .then(() => console.log('successful sign up'))
      .catch(err => console.log('error signing up: ', err));


    //if (!result) return setLoginFailed(true);

    //setLoginFailed(false);


  };

  const confirmSubmit = async ( { code } ) => {
    const confirm = await Auth.confirmSignUp(code)
    .then(() => console.log('successful confirmation'))
  }
  
  return (
    <SplitScreen style={styles.container}>
      <Image 
        style={styles.logo}
        source={require("../../../assets/Long-Logo.png")}
      />
      <View style={styles.formContainer}>
        <AppForm
          initialValues={{username: "", email: "" , password: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema1}
        >
          {/* <ErrorMessage error="Invalid email and/or password." visible={loginFailed}/> */}
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            name="username"
            placeholder="Username"
            textContentType="username"
            width={"98%"}
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
            width={"98%"}
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
            width={"98%"}
          />
          <TouchableOpacity>
            <AppText style={styles.forgotContainer} onPress={() => navigation.navigate(routes.REQUEST_PASS_EMAIL)}>
              Forgot Password?
            </AppText>
          </TouchableOpacity>
          <SubmitButton
            onPress={() => navigation.navigate(routes.VERIFY_ACCOUNT)} 
            title='Create Account' 
          />
          <TouchableWithoutFeedback>
            <AppText style={styles.textContainer} onPress={
              () => navigation.navigate(routes.SIGN_IN)}>
              Sign In
            </AppText>
          </TouchableWithoutFeedback>

        </AppForm>
        <AppForm
          initialValues={{code: ""}}
          onSubmit={confirmSubmit}
          validationSchema={validationSchema2}
        >
          <AppFormField
            autoCapitalize="none"
            name="code"
            placeholder="Verificaion Code"
            width={"98%"}
          />
          <SubmitButton 
            onPress ={() => navigation.navigate(routes.PLACEHOLDER)}
            title="Confirm"
          />
        </AppForm>
      </View>
    </SplitScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "5%",
  },
  formContainer: {
    marginTop: "25%",
  },
  forgotContainer: {
    alignSelf: "center",
    color: colors.lightBlue,
    fontSize: 16,
    marginTop: "5%",
    marginBottom: "5%",
    marginHorizontal: "1%",
  },
  logo: {
    height: "50%",
    //width: 400,
    alignSelf: 'center',
    marginTop: "10%",
    marginBottom: "5%",
    resizeMode: 'contain'
  },
  textContainer: {
    color: colors.medium,
    alignSelf: 'center',
    marginVertical: "10%"
  },
})

export default CreateAccountScreen;