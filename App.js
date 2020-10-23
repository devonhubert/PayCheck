import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import MainPage from './screens/MainPage';

import firebase from 'firebase';
import { firebaseConfig } from './config';
firebase.initializeApp(firebaseConfig);

class App extends Component {
  render() {
    return(
      <View style = {styles.container}>
        <AppNavigator />
      </View>
    );
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen:LoadingScreen,
  LoginScreen:LoginScreen,
  MainPage:MainPage,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
