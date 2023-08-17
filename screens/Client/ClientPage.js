import React from 'react';
import {StyleSheet, Button, View} from 'react-native';

export function ClientPage ({ navigation }){
  
    return (
      <View style={styles.container}>
          <View style={styles.button}>
          <Button
              title="BookList"
              onPress={() => {
                navigation.navigate ('Books');
              }}
            />
          </View>
          <View style={styles.button}>
          <Button
              title="Bookshelf"
              onPress={() => {
                navigation.navigate ('Favorite');
              }}
            />
            <View style={styles.button}>
          </View>
          </View>
        </View>
      
    );
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

  export default ClientPage;
