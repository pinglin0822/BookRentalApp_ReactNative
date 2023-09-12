import React,{useState} from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, TextInput,Button,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';
import { SERVER_URL } from '../../config.js';

export function ClientPage({ navigation }) {

  const socket = io(SERVER_URL);

socket.on('connect', () => {
  console.log(socket.id); // undefined
  socket.emit('client_connected', {connected: true});
});

  const [feedback, setFeedback] = useState('');
  const [receivedFeedback, setReceivedFeedback] = useState([]);

  const handleSendFeedback = () => {
    socket.emit('feedback', feedback);
    setFeedback('');
  };

  socket.on('feedback_response', (message) => {
    setReceivedFeedback([...receivedFeedback, message]);
  });

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
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackLabel}>Feedback</Text>
        <TextInput
          style={styles.feedbackInput}
          placeholder="Enter feedback"
          value={feedback}
          onChangeText={setFeedback}
        />
        <Button title="Send Feedback" onPress={handleSendFeedback} />
        <Text style={styles.receivedFeedbackLabel}>Received Feedback:</Text>
          {receivedFeedback.map((message, index) => (
            <Text key={index} style={styles.receivedFeedbackItem}>
              {message}
            </Text>
          ))}
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
  feedbackContainer: {
    backgroundColor: '#fff',
    width:'90%' ,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  feedbackLabel: {
    fontSize: 18,
    marginBottom: 10,
  },
  feedbackInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  receivedFeedbackLabel: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  receivedFeedbackList: {
    maxHeight: 200,
  },
  receivedFeedbackItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ClientPage;
