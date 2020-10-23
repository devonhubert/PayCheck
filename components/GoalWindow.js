import React, { Component } from 'react';
import { 
  View, ScrollView, Text
} from 'react-native';
import Spacer from './Spacer';
import Goal from './Goal';
const styles = require('../Styles');

class GoalWindow extends Component {
  constructor(props) {
    super(props);
  }

  displayGoals = () => {
    if(this.props.goals.length <= 0) {
      return(
        <View style={{alignSelf:'center', padding:10}}>
          <Text style={styles.text}>No Active Goals. Add One Above!</Text>
        </View>
      );
    } else {
      return(
        <View>
          {this.props.goals.map(goal => (
            <View key={goal["key"]} style={styles.padding}>
              <Goal
                name={goal["name"]} 
                needed={goal["needed"]} 
                earned={goal["earned"]} 
                goal={goal}
                removeGoal={this.props.removeGoal}
                returnMoneyEarned={this.props.setGoalMoneyUsed}
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

