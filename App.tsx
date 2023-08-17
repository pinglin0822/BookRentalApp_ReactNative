import React, { useState, useEffect } from "react";
import {StyleSheet,View,Text} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ClientPage } from "./screens/Client/ClientPage";
import { AdminPage } from "./screens/Admin/AdminPage";
import { BookList } from "./screens/BookList";
import { BookDetails } from "./screens/BookDetails";
import HomeScreen from './screens/HomeScreen';
import { AddBookForm } from './screens/Admin/AddBookForm';
import { Favorite } from './screens/Client/Favorite';
import  AdminBook from './screens/Admin/AdminBook';
import { BorrowedList } from './screens/Admin/BorrowedList';

const Stack = createNativeStackNavigator();

const App = () => {

  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Client" component={ClientPage}/>
        <Stack.Screen name="Admin" component={AdminPage}/>
        <Stack.Screen name="Books" component={BookList}/>
        <Stack.Screen name="BookDetails" component={BookDetails}/>
        <Stack.Screen name="AddBookForm" component={AddBookForm}/>
        <Stack.Screen name="Favorite" component={Favorite}/>
        <Stack.Screen name="AdminBook" component={AdminBook} />
        <Stack.Screen name="BorrowedList" component={BorrowedList} />
        <Stack.Screen name="Home" component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  Container: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  Text: {
    fontSize:20,
  }
})

export default App;