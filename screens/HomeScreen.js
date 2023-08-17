import React, {Component} from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';
export default class HomeScreen extends Component  {
  /**
   * A screen component can set navigation options such as the title.
   */
  render () {

    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.button}>
          <Button
            title="Client"
            onPress={() => {
              this.props.navigation.navigate ('Client');
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Admin"
            onPress={() => {
              this.props.navigation.navigate ('Admin');
            }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 20,
  },
  button: {
    margin: 10,
  },
});