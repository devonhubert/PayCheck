import React, { Component } from 'react';
import { TextInput, View, Text, Button, Alert} from 'react-native';
import Spacer from './Spacer';
const styles = require('../Styles');

//Handles user input of money
class InterfaceFrame extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        text: '',
      };  
    }
    
    addMoney = () => {
      const toAdd = Number(this.state.text);
      if(isNaN(toAdd)) {
        Alert.alert(
          "Not a Number",
          "Please enter a valid number, you silly! 😛",
          [{text: "OK", onPress: () => console.log("OK Pressed")}],
          {cancelable: false}
        );
      } else {
        this.setState({
          text: '',
        });
        this.props.returnMoneyEarned(toAdd);
      }
    }
  
    render() {
      console.log("InterfaceFrame Rendered. Money Earned is " + this.props.moneyEarned);
      return (
        <View style={{borderColor: '#234041', borderWidth: 1, width: 400, backgroundColor:'white'}}>
          <View style={{alignSelf:'center', padding:10}}>
            {/*Total Earned Display*/}
            <Text style={styles.text}>Total Earned: ${this.props.moneyEarned}</Text>
          </View>

          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <Text style={styles.text}>$ </Text>
            <View>
              {/*Money Adding Input*/}
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
              />    
            </View>
            <View>
              {/*Submit Button*/}
              <Button
                color="#234041"
                onPress={this.addMoney}
                title="Log Money Earned"
              />   
            </View>
          </View>

          <Spacer numSpaces='1' />
        </View>
      );
    }
}

export default InterfaceFrame;