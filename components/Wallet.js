import React, { Component } from 'react';
import { TextInput, View, Text, Button, Alert} from 'react-native';
import Spacer from './Spacer';
const styles = require('../Styles');

//Handles user input of money
class Wallet extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        text: '',
      };  
    }
    
    addMoney = () => {
      const toAdd = Math.floor(Number(this.state.text));
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
      console.log("Wallet Rendered.");
      return (
        <View style={{borderColor: '#234041', borderWidth: 1, backgroundColor:'white'}}>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.goalTextHeader}> My Wallet</Text>
            <View style={{width:36, height:36, flexDirection:'row', justifyContent:'center'}}>
              <Button
                color="#FFFFFF"
                onPress={() => this.props.toggleVisible()}
                title="✖️"
              />
              <Text> </Text>
            </View>
          </View>
          
          
          <View style={{width:200, flexDirection:'row', justifyContent:'flex-start'}}>
            <View style={{padding:5}}>
              <Text style={styles.goalText}>   Total Earned: ${this.props.moneyEarned}</Text>
            </View>
          </View>
          
          <Spacer numSpaces='1' />
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', alignSelf:'flex-start'}}>
            <Text style={styles.text}>  $</Text>
            
            {/*Money Adding Input*/}
            <TextInput
              style={styles.goalTextInput}
              keyboardType="number-pad"
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              maxLength={10}
            />    
            
            <Button
              color="#234041"
              onPress={this.addMoney}
              title="Add to Wallet"
            />  
            
          </View>
          <Spacer numSpaces='1' />
        </View>
      );
    }
}

export default Wallet;