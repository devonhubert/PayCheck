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

  componentDidMount() {
    console.log("Component mounted (it did)");
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
        
        this.pullMoneyEarned(user);
        this.pullKeyIndex(user);
        this.pullGoals(user);
    } 
  }

  pullMoneyEarned = (user) => {
    console.log("Pull money earned called");
    //user is not null
    if(user) {
      //pull total amount earned from database
      firebase
      .database()
      .ref('/users/' + user.uid + '/user_app_data/total_earned/')
      .on('value', snapShot => {
        let total_earned = snapShot.val(); //check for 0?
        console.log("Total earned is: " + total_earned);
        
        this.setState({
          moneyEarned: total_earned,
        });
      });
    }
  }

  writeTotalMoneyEarned = (totalEarned) => {
    var user = firebase.auth().currentUser;
    if(user) {
      firebase.database().ref('users/' + user.uid + '/user_app_data/').update({
        total_earned: totalEarned,
      });

      //update state from database
      this.pullMoneyEarned(user); //good?
    }
  }

  pullGoals = (user) => {
    console.log("Pull goals called");
    //user is not null
    if(user) {
      //pull goals earned from database
      firebase
      .database()
      .ref('/users/' + user.uid + '/user_app_data/goals/')
      .on('value', snapShot => {
        let goals = snapShot.val() ? snapShot.val() : [];
        console.log("Current goal object: " + goals);
        console.log("Length of goals: " + Object.keys(goals).length);

        this.setState({
          goals: goals, 
        });
        
      });
    } 
  }

  writeNewGoal = (goalName, moneyNeeded) => {
    var user = firebase.auth().currentUser;

    if (user) {
      firebase.database().ref('users/' + user.uid + '/user_app_data/goals/' + this.state.keyIndex).update({
        name: goalName,
        needed: moneyNeeded,
        earned: 0.0,
        key: this.state.keyIndex,
      });
      this.pullGoals(user);

      //Increment key index in database, and pull to state
      firebase.database().ref('users/' + user.uid + '/user_app_data/').update({
        key_index: this.state.keyIndex + 1, 
      });
      this.pullKeyIndex(user);
    }
  }

  pullKeyIndex = (user) => {
    console.log("Pull key index called");
    //user is not null
    if(user) {
      //pull keyIndex from database
      firebase
      .database()
      .ref('/users/' + user.uid + '/user_app_data/key_index')
      .on('value', snapShot => {
        //let data = snapShot.val() ? snapShot.val() : {};
        let key_index = snapShot.val();
        console.log("Key index is " + key_index);

        this.setState({
          keyIndex: key_index,
        });
        
      });
    }
  }
  
  addTotalMoneyEarned = (earned) => {
    console.log("Add Total Money Earned Called with earned = " + earned);
    let newTotal = this.state.moneyEarned + earned;
    this.writeTotalMoneyEarned(newTotal); 
    console.log("Money Earned Updated");
  }

  writeGoalMoneyEarned = (goalKey, earned) => {
    var user = firebase.auth().currentUser;
    if(user) {
      firebase.database().ref('users/' + user.uid + '/user_app_data/goals/' + goalKey).update({
        earned: earned,
      });

      //pull updated goals from database
      this.pullGoals(user); 
    }
  }

  setGoalMoneyEarned = (earned, oldTotal, key) => {
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
    
      this.writeGoalMoneyEarned(key, newTotal);
      console.log("Goal updated with new total: " + newTotal);
      
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
    } else if(goalName == "") {
      Alert.alert(
        "Invalid Entry",
        "Your goal needs a name!",
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
      this.writeNewGoal(goalName, moneyNeeded);
      console.log("Goal Added");
    }
  }

  removeGoal = (key) => {
    var user = firebase.auth().currentUser;

    if(user) {
      firebase.database().ref('users/' + user.uid + '/user_app_data/goals/' + key).remove();
      
      this.pullGoals(user);
      console.log("Goal Removed");
    }
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

        <GoalWindow 
          goals={this.state.goals} 
          removeGoal={this.removeGoal} 
          totalMoneyEarned={this.state.moneyEarned} 
          setGoalMoneyEarned={this.setGoalMoneyEarned}
        />
      
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

