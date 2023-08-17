import React from 'react';
import {StyleSheet, Button, View} from 'react-native';

export function AdminPage({ navigation }){
    
    return (
      <View style={styles.container}>

          <View style={styles.button}>
            <Button
              title="Add Book"
              onPress={() => {
                navigation.navigate ('AddBookForm');
              }}
            />
          </View>
          <View style={styles.button}>
        <Button
          title="Edit Book"
          onPress={() => {
            navigation.navigate('AdminBook');
          }}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Check Borrowed Books"
          onPress={() => {
            navigation.navigate('BorrowedList');
          }}
        />
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

export default AdminPage;

