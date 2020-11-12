import React, { Component, useState } from 'react';
import { 
  View, Alert, Image, Button
} from 'react-native';
import firebase from 'firebase';
import Modal from 'react-native-modal';

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
    isGoalAdderVisible: false,
    userName: 'No Name',
    userEmail: 'No Email',
    profilePicUrl: '../assets/newLogo.png',
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

        firebase
        .database()
        .ref('/users/' + user.uid + '/profile_picture')
        .on('value', querySnapShot => {
          let data = querySnapShot.val() ? querySnapShot.val() : {};
          let profile_picture = data;
          console.log("Profile picture url: " + profile_picture);
          this.setState({
            profilePicUrl: profile_picture,
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
      return "keepName";
    } else if(goalName == "") {
      //WHAT ABOUT IF BOTH HAVE AN ERROR?
      Alert.alert(
        "Invalid Entry",
        "Your goal needs a name!",
        [{text: "OK", onPress: () => console.log("OK Pressed")}],
        {cancelable: false}
      );
      return "keepNumber";
    } else if(Number(moneyNeeded) <= 0) {
      Alert.alert(
        "Invalid Entry",
        "Any goal worth saving for will require an amount of money greater than 0!",
        [{text: "OK", onPress: () => console.log("OK Pressed")}],
        {cancelable: false}
      );
      return "keepName";
    } else {
      this.writeNewGoal(goalName, moneyNeeded);
      this.toggleGoalAdderVisible();
      console.log("Goal Added");
      return "removeBoth";
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

  toggleGoalAdderVisible = () => {
    let flippedState = !this.state.isGoalAdderVisible;
    this.setState({
      isGoalAdderVisible: flippedState,
    });
  }  
  render() {
    
    console.log("App rendered. Current goal list is: " + this.state.goals);
    console.log("Current money earned is: " + this.state.moneyEarned);

    return (
      <View style={styles.container}>
        <Spacer numSpaces='7' />
        <View>      
          <Spacer numSpaces='3' />
          
          <View style={{flexDirection:'row', justifyContent:'space-between', width:370}}>
            <View>
              <Image source={require('../assets/newLogo.png')} style={styles.logoImage} />
            </View>
            
            <View style={{flexDirection:'row', justifyContent:'space-between', width:140}}>

              <View style={{flexDirection:'column', justifyContent: 'center'}}>
                <Button 
                  color="#234041"
                  title='Sign Out'
                  onPress={() => firebase.auth().signOut()}
                />
              </View>
        
              <View style={{flexDirection:'column', justifyContent: 'center'}}>
                <Image source={{
                  uri: this.state.profilePicUrl,
                  }} 
                  style={styles.profileImage}
                />
              </View>

            </View>
          </View>
        </View>

        <View> 
          <Spacer numSpaces='1' />   

          <InterfaceFrame 
            returnMoneyEarned={this.addTotalMoneyEarned} 
            moneyEarned={this.state.moneyEarned}
          />
        
          <Spacer numSpaces='1' />

          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <View style={{width:100, height:36}}>
              <Button
                color="#234041"
                onPress={this.toggleGoalAdderVisible}
                title="New Goal"
              />  
            </View>
          </View>
          
          <Modal 
            isVisible={this.state.isGoalAdderVisible}
            onBackdropPress={() => this.toggleGoalAdderVisible()}
          >
            <GoalAdder 
              addGoal={this.addGoal.bind(this)}
              toggleVisible={this.toggleGoalAdderVisible.bind(this)} 
            />
          </Modal>
          
          <GoalWindow 
            goals={this.state.goals} 
            removeGoal={this.removeGoal} 
            totalMoneyEarned={this.state.moneyEarned} 
            setGoalMoneyEarned={this.setGoalMoneyEarned}
          />
          <Spacer numSpaces='7' />
        </View>
        
      </View>
    );
  }
}

export default MainPage;

