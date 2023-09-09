import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function ClientPage({ navigation }) {

  return (

    <View style={styles.container}>

      <Image
        style={styles.image}
        source={require('../../assets/HomePagePoster.jpg')}
      />
      <View style={styles.iconContainer}>
        <TouchableOpacity style={{ paddingVertical: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 20,
            }}
          >
            <Ionicons color="darksalmon" name="book" size={30} />
            <Text
              style={{
                marginLeft: 20,
                fontSize: 23,

              }}
              onPress={() => {
                navigation.navigate('Books');
              }}
            >
              Book List
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{ paddingVertical: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 20,
            }}
          >
            <Ionicons color="firebrick" name="heart" size={30} />
            <Text
              style={{
                marginLeft: 20,
                fontSize: 23,

              }}
              onPress={() => {
                navigation.navigate('Favorite');
              }}
            >
              Favorite
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
  },
  image: {
    width: 360,
    height: 200,
    resizeMode: 'cover',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ClientPage;
