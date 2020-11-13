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
        this.props.toggleVisible();
      }
    }
  
    render() {
      console.log("InterfaceFrame Rendered.");
      return (
        <View style={{borderColor: '#234041', borderWidth: 1, backgroundColor:'white'}}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.goalTextHeader}> Log Earnings</Text>
            <View style={{width:36, height:36, flexDirection:'row', justifyContent:'center'}}>
              <Button
                color="#FFFFFF"
                onPress={() => this.props.toggleVisible()}
                title="✖️"
              />
              <Text> </Text>
            </View>
          </View>
          <Spacer numSpaces='1' />
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', alignSelf:'flex-start'}}>
            <Text style={styles.text}>  $</Text>
            <View style={{alignSelf:'flex-start'}}>
              {/*Money Adding Input*/}
              <TextInput
                style={styles.goalTextInput}
                keyboardType="numeric"
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
              />    
            </View>
          </View>
            <View style={{width:200, flexDirection:'row', justifyContent:'flex-end', alignSelf:'flex-end', padding:5}}>  
              <Button
                color="#234041"
                onPress={this.addMoney}
                title="Log"
              />  
              <Text> </Text>
            </View>
        </View>
      );
    }
}

export default InterfaceFrame;