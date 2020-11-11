import React, { Component } from 'react';
import { View, Button, TextInput, Text} from 'react-native';
const styles = require('../Styles');

//Interface to add Goal Windows to the app
class GoalAdder extends Component {
    constructor(props) {
      super(props);
      this.state = {
        goalName: '',
        moneyNeeded: '',
      };  
    }

    addGoal = () => {
      this.props.addGoal(this.state.goalName, this.state.moneyNeeded);
      this.setState({
        goalName: '',
        moneyNeeded: '',
      });
    }
  
    render() {
      console.log("Goal Adder Rendered with Goal Name: " + this.state.goalName);
      return(
        <View style={{borderColor: '#234041', borderWidth: 1, width:400, backgroundColor:'white'}}>
          <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
            <View style={{flexDirection:'column', padding:10}}>
              {/*Goal Name Input*/}
              <Text style={styles.text}>Name</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(goalName) => this.setState({goalName})}
                value={this.state.goalName}
              />   
            </View>

            <View style={{flexDirection:'column', padding:10}}>
              {/*Money Needed Input*/}
              <Text style={styles.text}>   Money Needed</Text>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={styles.text}>$ </Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  onChangeText={(moneyNeeded) => this.setState({moneyNeeded})}
                  value={this.state.moneyNeeded}
                />  
              </View>  
            </View> 
          </View>

          <View>  

            <Button
              color="#234041"
              onPress={this.addGoal}
              title="Add New Goal"
            />  
          </View>
        </View>
      );
    }  
}

export default GoalAdder;