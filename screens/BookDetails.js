import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, ScrollView, SafeAreaView, Button } from 'react-native';
import { getBook } from '../services/BooksService';

export function BookDetails({ route }) {
  const { bookID } = route.params;
  const [book, setBook] = useState({});

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const bookDetails = await getBook(bookID);
        setBook(bookDetails);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    }

    fetchBookDetails();
  }, [bookID]);

  function onAddToFav() {
    // Implement your logic to add the book to favorites
  }

  function onBorrowBook() {
    // Implement your logic to handle borrowing the book
  }

  return (
    <SafeAreaView>
      <ScrollView>
        {book.image ? (
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: book.image }} />
          </View>
        ) : null}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Title: {book.title}</Text>
          <Text style={styles.author}>Author: {book.author}</Text>
          <Text style={styles.descriptionHeader}>Description:</Text>
          <Text style={styles.description}>{book.description}</Text>
          <Button onPress={onAddToFav} color="#f7e00f" title="Add To Favorites" />
          <View style={styles.borrow}>
            {book.availability ? (
              <Button onPress={onBorrowBook} title="Borrow this Book" />
            ) : (
              <Button disabled={true} title="This book currently not available" />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: '5%',
  },
  image: {
    height: 300,
    width: '100%',
    aspectRatio: 1,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  author: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: 'grey',
  },
  descriptionHeader: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: 'black',
  },
  description: {
    fontSize: 18,
    fontWeight: '400',
    color: '#787878',
    marginBottom: 16,
    color: 'black',
  },
  borrow: {
    marginTop: '5%',
  },
});

export default BookDetails;