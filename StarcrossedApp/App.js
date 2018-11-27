import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import Root from '..\\home.jsx';
import axios from 'axios'
import User from '../user.jsx'
import _ from 'lodash'
//import '../style.scss';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hi sssswhats up man</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
