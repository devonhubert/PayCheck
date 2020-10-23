import React from 'react';
import { Text } from 'react-native';

const Spacer = (props) =>{
  var spaces = [];
  for(var i = 0; i < props.numSpaces; i++) {
    spaces.push(<Text key={i}></Text>);
  }
  return(
    <>
      {spaces}
    </>
  )
}

export default Spacer;