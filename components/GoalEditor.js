import React, { Component } from 'react';
import { View, Button, TextInput, Text} from 'react-native';
import firebase from 'firebase';
const styles = require('../Styles');

//Interface to add Goal Windows to the app
class GoalEditor extends Component {
    constructor(props) {
      super(props);
      this.state = {
        goalName: '',
        moneyNeeded: '',
      };  
    }

    componentDidMount() {
      var user = firebase.auth().currentUser;
      if(user) {
        this.setOldName(user);
        this.setOldMoneyNeeded(user);
      }
      

      
        //console.log("Name is " + oldName + ", needed is " + oldMoneyNeeded);
      
    }

    setOldName = (user) => {
      if(user) {
        firebase
          .database()
          .ref('/users/' + user.uid + '/user_app_data/goals/' + this.props.goalKey + '/name')
          .on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let name = data;
            this.setState({
              goalName: name,
            });
          });
      }
    }

    setOldMoneyNeeded = (user) => {
      if(user) {
        firebase
          .database()
          .ref('/users/' + user.uid + '/user_app_data/goals/' + this.props.goalKey + '/needed')
          .on('value', querySnapShot => {
            let data = querySnapShot.val() ? querySnapShot.val() : {};
            let needed = data;
            this.setState({
              moneyNeeded: needed,
            });
          });
      }
    }

    updateGoalHandler = () => {
      let keep = this.props.updateGoal(this.state.goalName, this.state.moneyNeeded, this.props.goalKey);
      if(keep == "keepName") {
        this.setState({
          moneyNeeded: '',
        });
      } else if(keep = "keepNumber") {
        this.setState({
          goalName: '',
        });
      } else if(keep == "removeBoth") {
        this.setState({
          goalName: '',
          moneyNeeded: '',
        });
      } else {
        console.log("Something went wrong...")
      }
    } 
  
    render() {
      console.log("Goal Editor Rendered for goal, key: " + this.props.goalKey);
      return(
        <View style={{borderColor: '#234041', borderWidth: 1, backgroundColor:'white'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={styles.goalTextHeader}> Update Goal</Text>
              <View style={{width:36, height:36, flexDirection:'row', justifyContent:'center'}}>
                <Button
                  color="#FFFFFF"
                  onPress={() => this.props.toggleVisible()}
                  title="✖️"
                />
                <Text> </Text>
              </View>
            </View>
            <View style={{flexDirection:'column', justifyContent:'space-evenly'}}>
              <View style={{flexDirection:'column', padding:10}}>
                {/*Goal Name Input*/}
                <Text style={styles.text}>   Name</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={styles.text}>  </Text>
                  <TextInput
                    style={styles.goalTextInput}
                    onChangeText={(goalName) => this.setState({goalName})}
                    value={this.state.goalName}
                    maxLength={20}
                  />  
                </View> 
              </View>

              <View style={{flexDirection:'column', padding:10}}>
                {/*Money Needed Input*/}
                <Text style={styles.text}>   Money Needed</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={styles.text}>$</Text>
                  <TextInput
                    style={styles.goalTextInput}
                    keyboardType="numeric"
                    onChangeText={(moneyNeeded) => this.setState({moneyNeeded})}
                    value={this.state.moneyNeeded}
                    maxLength={10}
                  />  
                </View>  
              </View> 
            </View>

            <Text></Text>
            <View style={{width:200, flexDirection:'row', justifyContent:'flex-end', alignSelf:'flex-end', padding:5}}>  
              <Button
                color="#234041"
                onPress={this.updateGoalHandler}
                title="Update"
              />  
              <Text> </Text>
            </View>
        </View>
      );
    }  
}

export default GoalEditor;