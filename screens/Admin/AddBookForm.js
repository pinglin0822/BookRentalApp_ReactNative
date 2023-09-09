import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, Image } from 'react-native';
import { insertBook, createTable } from '../../services/BooksService';
import { launchImageLibrary } from 'react-native-image-picker';

export function AddBookForm() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [availability, setAvailability] = useState(false);
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');

  const handleAddBook = async () => {

    await createTable();

    try {
      const newBook = {
        title,
        image,
        availability,
        description,
        author,
      };

      const insertedId = await insertBook(newBook);
      console.log('Book inserted with ID:', insertedId);

      // Reset form fields after successful insertion
      setTitle('');
      setImage('');
      setAvailability(false);
      setDescription('');
      setAuthor('');
    } catch (error) {
      console.error('Error inserting book:', error);
    }
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setImage(imageUri);
      }
    });
  };

  return (
    <View style={styles.container}>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ flex: 1 }}
          resizeMode="contain"
        />

      )}
      <View style={styles.infoContainer}>
        <Text style={styles.Text}>Title:</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="grey"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.Text}>Available:</Text>
        <Switch value={availability} onValueChange={setAvailability} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.Text}>Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="grey"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.Text}>Author:</Text>
        <TextInput
          style={styles.input}
          placeholder="Author"
          placeholderTextColor="grey"
          value={author}
          onChangeText={setAuthor}
        />
      </View>

      <View style={{ margin: 10 }}>
        <Button title="Upload Image" onPress={openImagePicker} />
      </View>

      <View style={{ margin: 10, color: 'green' }}>
        <Button color="#974EC3" title="Add Book" onPress={handleAddBook} />
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  infoContainer: {
    marginTop: 1
  },
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginTop: 5,
    marginBottom: 8,
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    color: 'black',
  },
  Text: {
    color: 'black',
    marginRight: "2%",
    fontWeight: 'bold',
    fontSize: 18,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '1%',
  },
});