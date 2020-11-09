import React, { Component } from 'react';
import { View } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import MainPage from './screens/MainPage';

import firebase from 'firebase';
import { firebaseConfig } from './config';
firebase.initializeApp(firebaseConfig);

const styles = require('./Styles');

class App extends Component {
  render() {
    return(
      <View style = {styles.outerContainer}>
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

export default App;
