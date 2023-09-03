
import React, { Component, useState, useEffect } from "react";
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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LogBox} from 'react-native';
LogBox.ignoreLogs (['EventEmitter.removeListener']);

import { Login, Signup } from "./screens";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
      
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false
          }}
        />
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

        {/* <Tab.Navigator
          initialRouteName={"Home"}
          screenOptions={{
            tabBarActiveTintColor: "#e91e63",
            tabBarActiveBackgroundColor: "pink",
            tabBarLabelStyle: {
              fontSize: 22,
            },
            tabBarStyle: {
              backgroundColor: "lightgrey",
              borderRadius: 50,
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: () => {
                return (
                  <Ionicons name="home" size={20} color={"red"} />
                );
              },
            }}
          />
        </Tab.Navigator> */}
      </NavigationContainer>
    );
  }
} 
