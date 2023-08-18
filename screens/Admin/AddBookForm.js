import React, { useState } from 'react';
import { View, Text, TextInput, Button,Switch, StyleSheet } from 'react-native';
import { insertBook, createTable } from '../../services/BooksService';

export function AddBookForm() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="grey"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Image"
        placeholderTextColor="grey"
        value={image}
        onChangeText={setImage}
      />
      <View style={styles.switchContainer}>
        <Text style={styles.availabilityText}>Available:</Text>
        <Switch value={availability} onValueChange={setAvailability} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="grey"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        placeholderTextColor="grey"
        value={author}
        onChangeText={setAuthor}
      />

      <Button title="Add Book" onPress={handleAddBook} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 8,
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    color:'black',
  },
  availabilityText: {
    color:'black',
    marginRight:"2%",
  },
  switchContainer: {
    flexDirection:'row',
    alignItems: 'center',
    marginBottom:'1%',
  },
});