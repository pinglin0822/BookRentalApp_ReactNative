import React, {Component} from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';
export default class HomeScreen extends Component<Props> {
  /**
   * A screen component can set navigation options such as the title.
   */
  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <View style={styles.button}>
          <Button
            title="BookList"
            onPress={() => {
              this.props.navigation.navigate ('Books');
            }}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="AddBookForm"
            onPress={() => {
              this.props.navigation.navigate ('AddBookForm');
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
