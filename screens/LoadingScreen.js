import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import firebase from 'firebase';
const styles = require('../Styles');

class LoadingScreen extends Component {

  componentDidMount(){
    this.checkIfLoggedIn();
  }
  
  checkIfLoggedIn = () =>{
    firebase.auth().onAuthStateChanged(
      function(user){
        if(user){
            this.props.navigation.navigate('MainPage');
        } else {
            this.props.navigation.navigate('LoginScreen');
        }
      }.bind(this)
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <Text></Text>
        <ActivityIndicator size="large"/>
      </View>
    );
  }
}

export default LoadingScreen;