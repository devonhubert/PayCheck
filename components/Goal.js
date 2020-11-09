import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import Spacer from './Spacer';
const styles = require('../Styles');


//Window for a single goal
class Goal extends Component {
  constructor(props) {
    super(props); 
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
    let moneyAmount = 1.0;
  
    if(this.props.earned < Number(this.props.needed)) { //Check for floats
      this.props.returnMoneyEarned(moneyAmount, this.props.earned, this.props.goal.key);
    }
  }
  
  checkCompleted() {
    if(this.props.earned >= Number(this.props.needed)) {
      return "Completed!";
    } else {
      return "$" + this.props.needed + " needed, $" + this.props.earned + " earned";
    }
  }

  render() {
    return (
      <View style={styles.goalWindow}>    
        {/*Remove Goal Button*/}
        <Button
          color="#234041"
          onPress={() => this.props.removeGoal(this.props.goal.key)}
          title="X"
        />   
        
        <View style={{padding:5}}>
          <Text style={styles.goalText}>  {this.props.name}</Text>
          <Text style={styles.goalText}>  {this.checkCompleted()}</Text>
          <Spacer numSpaces='1' />
          <Text style={styles.goalText}>  ({this.calculatePercent()}%)</Text>
          <Text style={styles.goalText}>  {this.showBar()}</Text>
        </View>
        
        {/*Add Funds Button*/}
        <Button
          color="#234041"
          onPress={this.onPress}
          title="Add $1"
        />   
            
      </View>
    );
  }
}

export default Goal;