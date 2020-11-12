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
      let keep = this.props.addGoal(this.state.goalName, this.state.moneyNeeded);
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
      console.log("Goal Adder Rendered with Goal Name: " + this.state.goalName);
      return(
        <View style={{borderColor: '#234041', borderWidth: 1, backgroundColor:'white'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
              <Text style={styles.goalTextHeader}> Goal Adder</Text>
              <View style={{width:36, height:36, flexDirection:'row', justifyContent:'center'}}>
                <Button
                  color="#FFFFFF"
                  onPress={() => this.props.toggleVisible()}
                  title="✖️"
                />
                <Text> </Text>
              </View>
            </View>
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