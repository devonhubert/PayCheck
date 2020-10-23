import React, { Component } from 'react';
import { 
  View, Alert, Image, Button, Text
} from 'react-native';
import firebase from 'firebase';

import InterfaceFrame from '../components/InterfaceFrame';
import GoalAdder from '../components/GoalAdder';
import Spacer from '../components/Spacer';
import GoalWindow from '../components/GoalWindow';

const styles = require('../Styles');

//Main App
class MainPage extends Component {

  //Load and save goals from database later

  state = {
    goals: [],
    keyIndex: 0,
    moneyEarned: 0,
    userName: 'No Name',
    userEmail: 'No Email',
  };

  doNothing = () => {

  }

  componentDidMount() {
    var user = firebase.auth().currentUser;

    if (user) {
      firebase
        .database()
        .ref('/users/' + user.uid + '/first_name')
        .on('value', querySnapShot => {
          let data = querySnapShot.val() ? querySnapShot.val() : {};
          let name = data;
          this.setState({
            userName: name,
          });
        });

        firebase
        .database()
        .ref('/users/' + user.uid + '/gmail')
        .on('value', querySnapShot => {
          let data = querySnapShot.val() ? querySnapShot.val() : {};
          let gmail = data;
          this.setState({
            userEmail: gmail,
          });
        });

    } 
  }
  
  addTotalMoneyEarned = (earned) => {
    console.log("Add Total Money Earned Called with earned = " + earned);
    let newTotal = this.state.moneyEarned + earned;
    this.setState({
      moneyEarned: newTotal,
    });
    console.log("Money Earned Updated");
  }

  setGoalMoneyUsed = (earned, oldTotal, key) => {
    let goals = this.state.goals;
    
    if(earned > this.state.moneyEarned) {
      Alert.alert(
        "Not Enough Money",
        "You're too poor to add that amount... 😢",
        [{text: "OK", onPress: () => console.log("OK Pressed")}],
        {cancelable: false}
      );
    } else {
      console.log("Set Goal Money Used Called with earned = " + earned);
      console.log("old total was: " + oldTotal);
      let newTotal = Number(oldTotal) + Number(earned);
    
      for (var i = goals.length - 1; i >= 0; i--) {
        if (goals[i]["key"] == key) {
          goals[i]["earned"] = newTotal;
          console.log("Goal updated with new total: " + newTotal);
        }
      }
      this.addTotalMoneyEarned(-1 * earned);
      console.log("Goal Money Used Updated for goal " + key);
    }
    return goals;
  }
  
  addGoal = (goalName, moneyNeeded) => {
    if(isNaN(Number(moneyNeeded))) {
      Alert.alert(
        "Not a Number",
        "Please enter a valid number, you silly! 😛",
        [{text: "OK", onPress: () => console.log("OK Pressed")}],
        {cancelable: false}
      );
    } else if(Number(moneyNeeded) <= 0) {
      Alert.alert(
        "Invalid Entry",
        "Any goal worth saving for will require an amount of money greater than 0!",
        [{text: "OK", onPress: () => console.log("OK Pressed")}],
        {cancelable: false}
      );
    } else {
      let newGoal = [{
        "name": goalName, 
        "needed": moneyNeeded, 
        "earned":"0.0", 
        "key":this.state.keyIndex
      }];

      
      this.setState({
        goals: newGoal.concat(this.state.goals), 
        keyIndex: this.state.keyIndex + 1,
      });
      


      console.log("Goal Added");
    }
  }
  
  removeGoalWithKey = (key) => {
    console.log("Removing goal with key: " + key);
    let goals = this.state.goals;
    for (var i = goals.length - 1; i >= 0; i--) {
      if (goals[i]["key"] == key) {
        goals.splice(i, 1);
      }
    }
    return goals;
  }

  removeGoal = (key) => {
    this.setState({
      goals: this.removeGoalWithKey(key),
    });
    console.log("Goal Removed");
  }
  
  render() {
    
    console.log("App rendered. Current goal list is: " + this.state.goals);
    console.log("Current money earned is: " + this.state.moneyEarned);

    return (
      <View style={styles.container}>        
        <Spacer numSpaces='3' />

        <Image source={require('../assets/logo.png')} style={styles.logoImage} />

        <View style={{padding:10}}>
          <Text style={styles.text}>Hello, {this.state.userName}!</Text>
        </View>
        
        <InterfaceFrame returnMoneyEarned={this.addTotalMoneyEarned} moneyEarned={this.state.moneyEarned}/>
      
        <Spacer numSpaces='1' />
        
        <GoalAdder addGoal={this.addGoal.bind(this)} />

        <GoalWindow goals={this.state.goals} removeGoal={this.removeGoal} setGoalMoneyUsed={this.setGoalMoneyUsed}/>
      
        <View style={{padding:10, flexDirection:'row', alignItems:'center'}}>
          <Text style={styles.text}>{this.state.userEmail}   </Text>
          <Button 
            color="#234041"
            title='Sign Out'
            onPress={() => firebase.auth().signOut()}
          />
        </View>
        
        
      </View>
    );
  }
}

export default MainPage;

