import React, { Component } from 'react';
import { 
  View, ScrollView, Text
} from 'react-native';
import Goal from './Goal';
const styles = require('../Styles');

class GoalWindow extends Component {
  constructor(props) {
    super(props);
  }

  //TEMPORARY FIX
  dictionaryToArray = (dictionary) => {
    let myArray = [];

    for(var key in dictionary){
      let arr = [dictionary[key]];
      myArray = arr.concat(myArray);
    }

    return myArray;
  }

  displayGoals = () => {
    if(Object.keys(this.props.goals).length <= 0) {
      return(
        <View style={{alignSelf:'center', padding:10}}>
          <Text style={styles.text}>No Active Goals. Add One Above!</Text>
        </View>
      );
    } else {
      return(
        <View>
           
          {this.dictionaryToArray(this.props.goals).map(goal => (
            <View key={goal.key} style={styles.padding}>
              <Goal
                name={goal.name} 
                needed={goal.needed} 
                earned={goal.earned} 
                goal={goal}
                removeGoal={this.props.removeGoal}
                returnMoneyEarned={this.props.setGoalMoneyEarned}
                totalMoneyEarned={this.props.totalMoneyEarned}
              /> 
            </View>
          ))} 

        </View>
      );
    }
    
  }

  render() {
    return(
      <ScrollView style={styles.scrollView}>   
        {this.displayGoals()}
      </ScrollView>
    );
  }

}

export default GoalWindow;

