import react from "react";
import {StyleSheet,View,Text} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BookList } from "./screens/BookList";
import { BookDetails } from "./screens/BookDetails";
import HomeScreen from './screens/HomeScreen';
import { AddBookForm } from './screens/AddBookForm';

const Stack = createNativeStackNavigator();

function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Books" component={BookList}/>
        <Stack.Screen name="BookDetails" component={BookDetails}/>
        <Stack.Screen name="AddBookForm" component={AddBookForm}/>
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