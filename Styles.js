import React from 'react';
import { StyleSheet } from 'react-native';

//Style Sheet
const styles = StyleSheet.create({
    text: {
      color: 'black',
      fontFamily: 'sans-serif-light',
      fontWeight: 'bold',
      fontSize: 15,
    },
    header: {
      color: 'black',
      fontFamily: 'sans-serif-light',
      fontWeight: 'bold',
      fontSize: 35,
      fontStyle: 'italic',
    },
    goalText: {
      color: 'black',
      fontFamily: 'sans-serif-light',
      fontWeight: 'bold',
      fontSize: 15,
    },
    logoImage: {
      width: 400,
      height: 100,
    },
    container: {
      width: 500,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#57b27a',
    },
    textInput: {
      height: 35, 
      width: 100,
      borderColor: '#234041', 
      borderWidth: 1,
      color: 'grey',
      fontFamily: 'sans-serif-light',
      fontWeight: 'bold',
      fontSize: 20,
    },
    goalWindow: {
      borderWidth: 1,
      borderColor: 'black',
      padding: 5,
      backgroundColor: 'white',
    },
    scrollView: {
      width: 400,
      borderColor: '#234041', 
      borderWidth: 1,
      backgroundColor: '#ccffcc',
    },
    padding: {
      padding: 5,
    },
  });

module.exports = styles;
