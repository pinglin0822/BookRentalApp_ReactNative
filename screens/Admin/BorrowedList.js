import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, StyleSheet, Alert, Text,Image,TouchableOpacity } from 'react-native';
import { getBorrowedBooks, removeBorrowedBook, updateAvailability } from '../../services/BooksService'; 

export function BorrowedList({image,navigation}) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    async function fetchBorrowedBooks() {
      try {
        const borrowed = await getBorrowedBooks();
        setBorrowedBooks(borrowed);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      }
    }

    fetchBorrowedBooks();
  }, []);

  function toggleBookSelection(bookId){
    const updatedSelectedBooks = selectedBooks.includes(bookId)
      ? selectedBooks.filter(id => id !== bookId)
      : [...selectedBooks, bookId];

    setSelectedBooks(updatedSelectedBooks);
  }


  function renderBook({ item: book }) {
    const isSelected = selectedBooks.includes(book.id);
    
    return (
      <View style={styles.bookContainer}>
      <Image style={styles.image} source={image} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>By {book.author}</Text>
          <Text style={styles.borrowedDate}>Borrowed: {book.borrowDate}</Text>
          <Text style={styles.returnDate}>Return: {book.returnDate}</Text>
        </View>
        <Button
          title={isSelected ? 'Selected' : 'Select'}
          onPress={() => toggleBookSelection(book.id)}
        />
      </View>
    );
  }
  
  const returnBook = ()=> {
    Alert.alert(
      'Return Book',
      'Are you sure these books had been returned?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const bookId of selectedBooks) {
                await updateAvailability(bookId, true);
                console.log('Availability updated');
                await removeBorrowedBook(bookId);
                console.log('removed updated');
              }
              const updatedBorrowedBooks = borrowedBooks.filter(
                (book) => !selectedBooks.includes(book.id)
              );
              setBorrowedBooks(updatedBorrowedBooks);


              Alert.alert('Book Returned', 'The book has been successfully returned.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]);
            } catch (error) {
              console.error('Error returning book:', error);

            }finally {
              setSelectedBooks([]);

            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.bookList}
        contentContainerStyle={styles.bookListContainer}
        data={borrowedBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBook}
      />
      <Button
        title=" Returned "
        onPress={returnBook}
        disabled={selectedBooks.length === 0}
    
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookList: {
    backgroundColor: '#eeeeee',
  },
  bookContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 4,
  },
  image: {
    width: 80,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center', 
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 16,
    color: 'gray',
  },
  borrowedDate: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
  returnDate: {
    fontSize: 14,
    color: 'red',
    marginTop: 4,
  },
  selectButton:{
    backgroundColor: '#007AFF',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  }
});


export default BorrowedList;