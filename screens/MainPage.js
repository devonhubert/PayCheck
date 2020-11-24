import React, { Component } from 'react';
import { 
  View, Alert, Image, Button, TouchableOpacity, Text
} from 'react-native';
import firebase from 'firebase';
import Modal from 'react-native-modal';

import Wallet from '../components/Wallet';
import GoalAdder from '../components/GoalAdder';
import GoalEditor from '../components/GoalEditor';
import Spacer from '../components/Spacer';
import GoalWindow from '../components/GoalWindow';

const styles = require('../Styles');

//Main App
class MainPage extends Component {

  state = {
    goals: [],
    keyIndex: 0,
    moneyEarned: 0,
    isGoalAdderVisible: false,
    isGoalEditorVisible: false,
    goalToEdit: -1,
    isGoogleInfoVisible: false,
    isWalletVisible: false,
    firstName: '',
    lastName: '',
    userEmail: '',
    profilePicUrl: '../assets/newLogo.png',
  };

  componentDidMount() {
    console.log("MainPage component mounted");
    var user = firebase.auth().currentUser;

    

    if (user) {
        
      this.getFirebaseRef(user, '/first_name')
        .on('value', querySnapShot => {
          let data = querySnapShot.val() ? querySnapShot.val() : {};
          this.setState({
            firstName: data,
          });
        });
        

      this.getFirebaseRef(user, '/last_name')
        .on('value', querySnapShot => {
          let data = querySnapShot.val() ? querySnapShot.val() : {};
          this.setState({
            lastName: data,
          });
        });

      this.getFirebaseRef(user, '/gmail')
        .on('value', querySnapShot => {
          let data = querySnapShot.val() ? querySnapShot.val() : {};
          this.setState({
            userEmail: data,
          });
        });

      this.getFirebaseRef(user, '/profile_picture')
        .on('value', querySnapShot => {
          let data = querySnapShot.val() ? querySnapShot.val() : {};
          this.setState({
            profilePicUrl: data,
          });
        });
        
        this.pullMoneyEarned(user);
        this.pullKeyIndex(user);
        this.pullGoals(user);
    } 
  }

  getFirebaseRef = (user, path) => {
    if(user){
      console.log("Valid user, pulling from database");
      return firebase.database().ref('/users/' + user.uid + path);
    } else {
      console.log("Invalid user, no access to database");
      return null;
    }
  }

  pullMoneyEarned = (user) => {
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

  writeGoal = (goalName, moneyNeeded, key) => {
    var user = firebase.auth().currentUser;

    if (user) {
      //If New Goal...
      if(key == -1) {
        //overwrite with new index
        key = this.state.keyIndex;
        firebase.database().ref('users/' + user.uid + '/user_app_data/goals/' + key).update({
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
      } else { 

        //Updating Existing Goal
        this.setState({
          goalToEdit: -1,
        });

        firebase.database().ref('users/' + user.uid + '/user_app_data/goals/' + key).update({
          name: goalName,
          needed: moneyNeeded,
        });
        this.pullGoals(user);
        Alert.alert(
          "Goal Updated",
          "Your goal was successfully updated!",
          [{text: "OK", onPress: () => console.log("OK Pressed")}],
          {cancelable: false}
        );
      }
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
      this.writeGoal(goalName, moneyNeeded, -1);
      this.toggleGoalAdderVisible();
      console.log("Goal Added");
      return "removeBoth";
    }
  }

  updateGoal = (goalName, moneyNeeded, key) => {
    if(isNaN(Number(moneyNeeded))) {
      Alert.alert(
        "Not a Number",
        "Please enter a valid number, you silly! 😛",
        [{text: "OK", onPress: () => console.log("OK Pressed")}],
        {cancelable: false}
      );
      return "keepName";
    } else if(goalName == "") {
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
      this.writeGoal(goalName, moneyNeeded, key);
      this.toggleGoalEditorVisible();
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

  editGoal = (key) => {
    console.log("Main page editGoal called from key " + key);
    this.setState({
      goalToEdit: Number(key),
    });
    this.toggleGoalEditorVisible();
  }

  toggleGoalAdderVisible = () => {
    let flippedState = !this.state.isGoalAdderVisible;
    this.setState({
      isGoalAdderVisible: flippedState,
    });
  }  

  toggleGoalEditorVisible = () => {
    let flippedState = !this.state.isGoalEditorVisible;
    this.setState({
      isGoalEditorVisible: flippedState,
    });
  }  

  toggleGoogleInfoVisible = () => {
    let flippedState = !this.state.isGoogleInfoVisible;
    this.setState({
      isGoogleInfoVisible: flippedState,
    });
  }  

  toggleWalletVisible = () => {
    let flippedState = !this.state.isWalletVisible;
    this.setState({
      isWalletVisible: flippedState,
    });
  }  

  render() {
    
    console.log("App rendered. Current goal list is: " + this.state.goals);
    console.log("Current money earned is: " + this.state.moneyEarned);

    return (
      <View style={styles.container}>
        {/* Ancestor View */}
        <Spacer numSpaces='8' />

        {/* Top Menu Bar */}
        <View>      
          <Spacer numSpaces='3' />
          
          <View style={{flexDirection:'row', justifyContent:'space-between', width:370}}>

            {/* PayCheck Logo */}
            <View style={{flexDirection:'column', justifyContent: 'center'}}>
              <Image source={require('../assets/newLogo.png')} style={styles.logoImage} />
            </View>

            <View style={{flexDirection:'column', justifyContent:'center'}}>
              
              
              {/* Wallet Icon Button */}
              <TouchableOpacity 
                  style={{flexDirection:'row', justifyContent: 'center', alignSelf:'center'}}
                  onPress={this.toggleWalletVisible}
                >
                <View>
                  <Image source={require('../assets/wallet_icon.png')} 
                    style={styles.walletIcon}
                  />
                </View>
              </TouchableOpacity>
               
              {/* Total Earned Display */}
              <View style={{alignSelf:'center'}}>
                <Text style={styles.goalText}>${this.state.moneyEarned}</Text>
              </View>
              
            </View>
            
            {/* Google Icon Button */}
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <TouchableOpacity 
                style={{flexDirection:'column', justifyContent: 'center'}}
                onPress={this.toggleGoogleInfoVisible}
              >
                <View>
                  <Image source={{
                      uri: this.state.profilePicUrl,
                    }} 
                    style={styles.profileImage}
                  />
                </View>
              </TouchableOpacity>
            </View>

          </View>

        </View>

        <Spacer numSpaces='1' /> 
        
        {/* Modals */}
        <View> 
          
          {/* Money Logger */}
          <Modal 
            isVisible={this.state.isWalletVisible}
            onBackdropPress={() => this.toggleWalletVisible()}
          >
            <Wallet 
              returnMoneyEarned={this.addTotalMoneyEarned.bind(this)} 
              toggleVisible={this.toggleWalletVisible.bind(this)}
              moneyEarned={this.state.moneyEarned}
            />
          </Modal>
          
          {/* Goal Adder */}
          <Modal 
            isVisible={this.state.isGoalAdderVisible}
            onBackdropPress={() => this.toggleGoalAdderVisible()}
          >
            <GoalAdder 
              addGoal={this.addGoal.bind(this)}
              toggleVisible={this.toggleGoalAdderVisible.bind(this)} 
            />
          </Modal>

          {/* Goal Editor */}
          <Modal 
            isVisible={this.state.isGoalEditorVisible}
            onBackdropPress={() => this.toggleGoalEditorVisible()}
          >
            <GoalEditor 
              updateGoal={this.updateGoal.bind(this)}
              goalKey={this.state.goalToEdit}
              toggleVisible={this.toggleGoalEditorVisible.bind(this)} 
            />
          </Modal>

          {/* Google Information */}
          <Modal 
            isVisible={this.state.isGoogleInfoVisible}
            onBackdropPress={() => this.toggleGoogleInfoVisible()}
          >
            <View style={{borderColor: '#234041', borderWidth: 1, backgroundColor:'white'}} >
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.goalTextHeader}> My Google Account</Text>
                  <View style={{width:36, height:36, flexDirection:'row', justifyContent:'center'}}>
                    <Button
                      color="#FFFFFF"
                      onPress={() => this.toggleGoogleInfoVisible()}
                      title="✖️"
                    />
                
                </View>
              </View>
                    
              <Spacer numSpaces='1' />

              <View style={{alignSelf:'center'}}>
                <Text style={styles.goalText}>Email: {this.state.userEmail}</Text>
              </View>
                    
              <Spacer numSpaces='1' />
                    
              <View style={{alignSelf:'center'}}>
                <Text style={styles.goalText}>Name: {this.state.firstName} {this.state.lastName}</Text>
              </View>
              
              <Spacer numSpaces='2' />

              <Button 
                color="#234041"
                title='Sign Out'
                onPress={() => firebase.auth().signOut()}
              />
            </View>
          </Modal>


          {/* Main Goal Window */}
          <GoalWindow 
            goals={this.state.goals} 
            removeGoal={this.removeGoal} 
            editGoal={this.editGoal}
            totalMoneyEarned={this.state.moneyEarned} 
            setGoalMoneyEarned={this.setGoalMoneyEarned}
            toggleGoalAdderVisible={this.toggleGoalAdderVisible}
          />
          <Spacer numSpaces='7' />
        </View>
        
      </View>
    );
  }
}

export default MainPage;

