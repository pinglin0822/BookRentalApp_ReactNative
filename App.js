import React, { Component, useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import ClientPage from "./screens/Client/ClientPage";
import { BookList } from "./screens/BookList";
import { BookDetails } from "./screens/BookDetails";
import { UpdateDetails } from "./screens/Admin/UpdateDetails";
import { AddBookForm } from './screens/Admin/AddBookForm';
import { Favorite } from './screens/Client/Favorite';
import AdminBook from './screens/Admin/AdminBook';
import { BorrowedList } from './screens/Admin/BorrowedList';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LogBox } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { Login, Signup } from "./screens";
LogBox.ignoreLogs(['EventEmitter.removeListener']);

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

class CustomDrawerComponent extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FF8551', paddingTop: 40 }}>
        <DrawerContentScrollView {...this.props}>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={{
                width: 80,
                height: 80,
              }}
              source={require('./assets/logo.jpg')}
            />
            <Text style={{ color: 'white', fontSize: 20, marginTop: 10 }}>My Book Buddy</Text>
          </View>

          <View style={{ backgroundColor: '#FF8551', flex: 1, paddingTop: 10 }}>
            <DrawerItemList
              {...this.props}
            />
          </View>
        </DrawerContentScrollView>

        <DrawerContentScrollView>
          <View style={{ borderTopWidth: 1, borderTopColor: 'white' }} />
          <TouchableOpacity style={{ paddingVertical: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20,
              }}
            >
              <Ionicons name="exit-outline" size={23} color="white" />
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 23,
                  color: 'white',
                }}
                onPress={() => {
                  this.props.navigation.navigate('Login');
                }}
              >
                Switch Account
              </Text>
            </View>
          </TouchableOpacity>
        </DrawerContentScrollView>
      </View>
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="Client" component={ClientDrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Admin" component={AdminDrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Books" component={BookList} />
          <Stack.Screen name="AddBookForm" component={AddBookForm} />
          <Stack.Screen name="Favorite" component={Favorite} />
          <Stack.Screen name="AdminBook" component={AdminBook} />
          <Stack.Screen name="BorrowedList" component={BorrowedList} />
          <Stack.Screen name="BookDetails" component={BookDetails} />
          <Stack.Screen name="UpdateDetails" component={UpdateDetails} />

        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const ClientDrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="MenuTab"
    drawerContent={(props) => <CustomDrawerComponent {...props} />}
    drawerStyle={{
      backgroundColor: '#FF8551',
    }}
    screenOptions={{
      headerStyle: {
        backgroundColor: '#FF8551',
      },
      headerTintColor: 'white',
    }}
  >
    <Drawer.Screen
      name="Home"
      component={HomeTabNavigator}
      options={{
        drawerIcon: () => (
          <Ionicons name="planet" size={20} color='white' />
        ),
        drawerLabelStyle: {
          fontSize: 23,
          color: "white"
        },
      }}
    />
    <Drawer.Screen
      name="BookList"
      component={BookListTabNavigator}
      options={{
        drawerIcon: () => (
          <Ionicons name="book" size={20} color={'white'} />
        ),
        drawerLabelStyle: {
          fontSize: 23,
          color: "white"
        },
      }}
    />
    <Drawer.Screen
      name="Favorite"
      component={FavoriteTabNavigator}
      options={{
        drawerIcon: () => (
          <Ionicons name="heart" size={20} color={'white'} />
        ),
        drawerLabelStyle: {
          fontSize: 23,
          color: "white"
        },
      }}
    />
  </Drawer.Navigator>
);

const HomeTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={ClientPage}
      options={{
        tabBarColor: '#FBF0B2',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="planet" size={size} color={color} />
        ), headerShown: false,
      }}
    />
    <Tab.Screen
      name="Book List"
      component={BookList}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="book" size={size} color={color} />
        ), headerShown: false,
      }}
    />
    <Tab.Screen
      name="Favorite"
      component={Favorite}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart" size={size} color={color} />
        ), headerShown: false,
      }}
    />
  </Tab.Navigator>
);

const BookListTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Book List"
      component={BookList}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="book" size={size} color={color} />
        ), headerShown: false,
      }}
    />
    <Tab.Screen
      name="Home"
      component={ClientPage}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="planet" size={size} color={color} />
        ), headerShown: false,
      }}
    />
    <Tab.Screen
      name="Favorite"
      component={Favorite}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart" size={size} color={color} />
        ), headerShown: false,
      }}
    />
  </Tab.Navigator>
);

const FavoriteTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Favorite"
      component={Favorite}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart" size={size} color={color} />
        ), headerShown: false,
      }}
    />
    <Tab.Screen
      name="Book List"
      component={BookList}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="book" size={size} color={color} />
        ), headerShown: false,
      }}
    />
    <Tab.Screen
      name="Home"
      component={ClientPage}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="planet" size={size} color={color} />
        ), headerShown: false,
      }}
    />

  </Tab.Navigator>
);

const AdminDrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerComponent {...props} />}
    drawerStyle={{
      backgroundColor: '#FF8551',
    }}
    screenOptions={{
      headerStyle: {
        backgroundColor: '#FF8551',
      },
      headerTintColor: 'white',
    }}
  >
    <Drawer.Screen
      name="Add Book"
      component={AddBookTabNavigator}
      options={{
        drawerIcon: () => (
          <Ionicons name="add-circle" size={20} color={'white'} />
        ),
        drawerLabelStyle: {
          fontSize: 23,
          color: 'white'
        },
      }}
    />
    <Drawer.Screen
      name="Edit Book"
      component={EditBookTabNavigator}
      options={{
        drawerIcon: () => (
          <Ionicons name="create" size={20} color={'white'} />
        ),
        drawerLabelStyle: {
          fontSize: 23,
          color: 'white'
        },
      }}
    />
    <Drawer.Screen
      name="Check Borrowed"
      component={CheckBorrowedTabNavigator}
      options={{
        drawerIcon: () => (
          <Ionicons name="file-tray" size={20} color={'white'} />
        ),
        drawerLabelStyle: {
          fontSize: 19,
          color: 'white',
        },
      }}
    />
  </Drawer.Navigator>
);

const AddBookTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Add Book"
      component={AddBookForm}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle" size={size} color={color} />
        ), headerShown: false
      }}
    />
    <Tab.Screen
      name="Edit Book"
      component={AdminBook}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="create" size={size} color={color} />
        ), headerShown: false
      }}
    />
    <Tab.Screen
      name="Check Borrowed"
      component={BorrowedList}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="file-tray" size={size} color={color} />
        ), headerShown: false
      }}
    />

  </Tab.Navigator>
);

const EditBookTabNavigator = () => (

  <Tab.Navigator>
    <Tab.Screen
      name="Edit Book"
      component={AdminBook}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="create" size={size} color={color} />
        ), headerShown: false
      }}
    />
    <Tab.Screen
      name="Add Book"
      component={AddBookForm}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle" size={size} color={color} />
        ), headerShown: false
      }}
    />

    <Tab.Screen
      name="Check Borrowed"
      component={BorrowedList}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="file-tray" size={size} color={color} />
        ), headerShown: false
      }}
    />

  </Tab.Navigator>
);

const CheckBorrowedTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Check Borrowed"
      component={BorrowedList}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="file-tray" size={size} color={color} />
        ), headerShown: false
      }}
    />


    <Tab.Screen
      name="Edit Book"
      component={AdminBook}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="create" size={size} color={color} />
        ), headerShown: false
      }}
    />

    <Tab.Screen
      name="Add Book"
      component={AddBookForm}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle" size={size} color={color} />
        ), headerShown: false,
      }}
    />


  </Tab.Navigator>
);