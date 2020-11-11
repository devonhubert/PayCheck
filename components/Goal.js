import React, { Component } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import Spacer from './Spacer';
import Slider from '@react-native-community/slider';
const styles = require('../Styles');


//Window for a single goal
class Goal extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      currSliderVal:0,  
    };  
  }
  
  calculatePercent() {
    return Math.floor((this.props.earned/this.props.needed) * 100);
  }
  
  showBar() {
    let percent = this.calculatePercent();
    let result = '';
    let divisionNumber = 10;
    
    for(let i = 0; i < divisionNumber; i++) {
      if(i < Math.floor(percent/divisionNumber)) {
        result += '#';
      } else {
        result += ' ';
      }
    } 
    return result;
  }
  
  onPress = () => {
    let moneyAmount = this.state.currSliderVal;
  
    if(this.props.earned < Number(this.props.needed)) { //Check for floats
      this.props.returnMoneyEarned(moneyAmount, this.props.earned, this.props.goal.key);
    }

    this.setState({
      currSliderVal: 0,
    })
  }
  
  checkCompleted() {
    if(this.props.earned >= Number(this.props.needed)) {
      Alert.alert(
        "Goal Completed!",
        "Good job, you completed " + this.props.name + "!",
        [{text: "OK", onPress: () => console.log("OK Pressed")}],
        {cancelable: false}
      );
      this.props.removeGoal(this.props.goal.key);
    } else {
      return "$" + this.props.needed + " needed, $" + this.props.earned + " earned";
    }
  }

  findMinimumValue = () => {
    let earned = this.props.earned;
    if(earned == 0) {
      return 0;
    } else {
      return earned * (-1);
    }
  }

  findMaximumValue = () => {
    let totalEarned = Number(this.props.totalMoneyEarned);
    let needed = Number(this.props.needed - this.props.earned);
    if(totalEarned > needed) {
      return needed;
    } else {
      return totalEarned;
    }
  }

  getButtonText = () => {
    let sliderVal = this.state.currSliderVal;
    if(sliderVal < 0) {
      return "Remove $" + ((-1) * sliderVal);
    } else {
      return "Add $" + sliderVal;
    }
  }

  render() {
    return (
      <View style={styles.goalWindow}>    
        {/*Remove Goal Button*/}
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={styles.goalTextHeader}>  {this.props.name}</Text>

          <View style={{width:36, height:36}}>
            <Button
              color="#FFFFFF"
              onPress={() => this.props.removeGoal(this.props.goal.key)}
              title="✖️"
            /> 
          </View>  
        </View>
        
        <View style={{padding:5}}>
          
          <Text style={styles.goalText}>  {this.checkCompleted()}</Text>
          <Spacer numSpaces='1' />
          <Text style={styles.goalText}>  ({this.calculatePercent()}%)</Text>
          <Text style={styles.goalText}>  {this.showBar()}</Text>
        </View>
        
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.goalText}>   {this.findMinimumValue()}</Text>
            <Slider
              style={{width: 200, height: 40}}
              minimumValue={this.findMinimumValue()}
              value={0}
              maximumValue={this.findMaximumValue()}
              thumbTintColor={"#234041"}
              step={1}
              minimumTrackTintColor="#234041"
              maximumTrackTintColor="grey"
              onValueChange={val => this.setState({ currSliderVal: val })}
            />
            <Text style={styles.goalText}>{this.findMaximumValue()}</Text>
          </View>
          
          <View style={{width:100}}>
            <Button
              color="#234041"
              onPress={this.onPress}
              title={"" + this.getButtonText()}
            />  
          </View>
        </View>
          
      </View>
    );
  }
}

export default Goal;