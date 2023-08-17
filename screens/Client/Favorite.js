import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Button } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getFavoriteBooks, borrowBook, getBook, checkBookAvailability , updateAvailability } from '../../services/BooksService'; 
import { Book } from '../../components/Book';
import DatePicker from 'react-native-date-picker'

export function Favorite() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchFavoriteBooks();
    }, [])
  );

  async function fetchFavoriteBooks() {
    try {
      const favorites = await getFavoriteBooks();
      console.log('Favorite Books:', favorites);
      setFavoriteBooks(favorites);
    } catch (error) {
      console.error('Error fetching favorite books:', error);
    }
  }

  async function toggleBookSelection(bookId) {
    const isAvailable = await checkBookAvailability(bookId);

    if (isAvailable == 0) {
      Alert.alert('Book Not Available', 'This book is currently not available for borrowing.');
      return;
    }
    
    const updatedSelectedBooks = selectedBooks.includes(bookId)
      ? selectedBooks.filter(id => id !== bookId)
      : [...selectedBooks, bookId];

    if (updatedSelectedBooks.length > 5) {
      Alert.alert('Limit Exceeded', 'You can select up to 5 books.');
      return;
    }
    setSelectedBooks(prevSelectedBooks => {
      if (prevSelectedBooks.includes(bookId)) {
        return prevSelectedBooks.filter(id => id !== bookId);
      } else {
        return [...prevSelectedBooks, bookId];
      }
    });
    setSelectedBooks(updatedSelectedBooks);
  }

  const handleBorrowBooks = () => {
    if (selectedBooks.length == 0) {
      Alert.alert('No Books Selected', 'Please select at least one book to borrow.');
      return;
    }
    // Show the calendar picker modal
    setOpen(true)
  };

  const handleDateConfirm = async (selectedDate) => {
    try {
        const borrowDate = selectedDate.toLocaleDateString();
        const borrowedBooks = await Promise.all(selectedBooks.map(async (bookId) => {
        const book = await getBook(bookId);
        const returnDate = new Date(borrowDate);
        returnDate.setDate(returnDate.getDate() + 14);
        const formattedReturnDate = returnDate.toLocaleDateString();

        await updateAvailability(bookId, false);
        await borrowBook(bookId, borrowDate, formattedReturnDate );
        setOpen(false);

        return { book, borrowDate, formattedReturnDate };
      }));

      const formattedReturnDates = borrowedBooks.map(({ formattedReturnDate }) => formattedReturnDate);
      // Generate and display successful details
      const numBorrowedBooks = borrowedBooks.length;
      const detailsMessage = [
        `Borrowed Successful..`,
        `You had borrowed ${numBorrowedBooks} book(s):`,
        ...borrowedBooks.map(({ book }) => `- ${book.title}`),
        `Borrow Date: ${borrowDate}`,
        `Return Date: ${formattedReturnDates.join(', ')}`,
      ].join('\n');

      Alert.alert(
        'Borrow Successful',
        `You have successfully borrowed ${numBorrowedBooks} book:\n${detailsMessage}`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error borrowing books:', error);
      Alert.alert('Error', 'An error occurred while borrowing books. Please try again later.');
    }
  };

  function renderBook({ item: book }) {
    const isSelected = selectedBooks.includes(book.id);
    return (
      <Book
        {...book}
        onPress={() => toggleBookSelection(book.id)}
        isSelected={isSelected}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.bookList}
        contentContainerStyle={styles.bookListContainer}
        data={favoriteBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBook}
      />
      <Button
        title="Borrow Selected Books"
        onPress={handleBorrowBooks}
        disabled={selectedBooks.length === 0}
      />
      <DatePicker
        modal
        mode='date'
        open = {open}
        date = {selectedStartDate}
        onConfirm = {(selectedDate) => {
          setOpen(false);
          setSelectedStartDate(selectedDate);
          handleDateConfirm(selectedDate);
          }}
        onCancel = {() => {
          setOpen(false);
        }
        }
        />
    </View>
  );
}

const styles = StyleSheet.create({
  bookList: {
    backgroundColor: "#eeeeee",
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
    notification: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationText: {
      color: 'white',
      fontSize: 16,
    },
});