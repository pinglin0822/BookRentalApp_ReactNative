import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, ScrollView, Alert, SafeAreaView, Button  } from 'react-native';
import { getBook, borrowBook , checkBookAvailability, toggleBookFavoriteStatus, isBookInFavorites, updateAvailability } from '../services/BooksService';
import DatePicker from 'react-native-date-picker'

export function BookDetails({ route, navigation }) {
  const { bookID } = route.params;
  const [book, setBook] = useState({});
  const { setFavoriteBooks } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [notification, setNotification] = useState({ message: '', isVisible: false });
  const [borrowDate, setBorrowDate] = useState(new Date()); 
  const [open, setOpen] = useState(false);


  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const bookDetails = await getBook(bookID);
        setBook(bookDetails);

        // Check if the book is in favorites and update the state accordingly
        const isInFavorites = await isBookInFavorites(bookID);
        setIsFavorite(isInFavorites);

      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    }

    fetchBookDetails();
  }, [bookID]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification({ ...notification, isVisible: false });
    }, 2000);

    return () => clearTimeout(timer);

  }, [notification]);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateFavoriteStatus();
    });

    return unsubscribe;
  }, [updateFavoriteStatus, navigation]);

  //Add and remove from Favourite
  const onAddToFav = async() =>{
    try {
      if (isFavorite) {
        // Remove the book from favorites
        await toggleBookFavoriteStatus(bookID);
        setIsFavorite(false);
        // Remove the book from the favoriteBooks state in Favorite
        setFavoriteBooks((prevBooks) => prevBooks.filter((favBook) => favBook.id !== bookID));
        setNotification({ message: 'Removed from Favorites', isVisible: true });

      } else {
        // Add the book to favorites
        await toggleBookFavoriteStatus(bookID);
        setIsFavorite(true);
        setFavoriteBooks((prevBooks) => [...prevBooks, book]);
        setNotification({ message: 'Added to Favorites', isVisible: true });   Alert.alert('Added to Favorites', 'This book has been added to your favorites.');
      }
    } catch (error) {
      console.error('Error adding/removing book from favorites:', error);
    }
  };

  //Update Favourite Status
  const updateFavoriteStatus = async () => {
    try {
      const isInFavorites = await isBookInFavorites(bookID);
      setIsFavorite(isInFavorites);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  //Borrow books
  const onBorrowBook = async (selectedDate) => {
    try {
      const isAvailable = await checkBookAvailability(bookID);
      
      if (isAvailable == 1) {
        setOpen(true);
        
        const returnDate = new Date(selectedDate);
        returnDate.setDate(returnDate.getDate() + 14); // Adding 14 days

        const formattedSelectedDate = selectedDate.toLocaleDateString();
        const formattedReturnDate = returnDate.toLocaleDateString();

        await updateAvailability(bookID, false);
        await borrowBook(bookID, formattedSelectedDate, formattedSelectedDate);

        setNotification({ message: 'Book Borrowed Successfully', isVisible: true });
        setOpen(false);
        
        try {
          const detailsMessage = `${book.title} \n\nBorrowed on: \n${formattedSelectedDate}\n\nPlease return it by: \n${formattedReturnDate}`;
          
          Alert.alert(
            'Borrow Successful',
            `You have successfully borrowed ${detailsMessage}`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
            
          );

        } catch (error) {
          console.error('Error borrowing book:', error);
          // Handle the error (e.g., show an error message to the user)
        }

      }else{
        Alert.alert('Book Not Available', 'This book is currently not available for borrowing.');
        return;
      }
      } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };


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
          <Button onPress={onAddToFav} color="#f7e00f" title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'} />
        </View>

        <View style={styles.infoContainer}>
          <Button onPress={onBorrowBook} color="#f7e00f" title="Borrow Book" />
          <DatePicker
          modal
          mode='date'
          open = {open}
          date = {borrowDate}
          minimumDate={new Date()}
          onConfirm = {(selectedDate) => {
            setOpen(false);
            setBorrowDate(selectedDate);
            onBorrowBook(selectedDate);
          }}
          onCancel = {() => {
            setOpen(false);
          }
          }
          />
          
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

  calendarContainer: {
    flex: 1, // Adjust the flex value as needed to allocate space
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  calendarLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: 'black',
  },
});

export default BookDetails;