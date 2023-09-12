import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TouchableHighlight, Alert, Image } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { deleteBook,getBookList } from '../../services/BooksService';
import { SwipeListView } from 'react-native-swipe-list-view';

const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

export function AdminBook({ navigation }) {
  const [tableData, setTableData] = useState([]);



  useEffect(() => {
    fetchDataFromDatabase();
  }, []);

  const fetchDataFromDatabase = () => {
    getBookList()
      .then((books)=>{
        const fetchedData = books;
          setTableData(fetchedData);
      })
  };


  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  const removeBook = index => {
    Alert.alert(
      'Remove Book',
      'Are you sure you want to remove this book?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const removedBookId = tableData[index].id;
              console.log('deleting book with id: '+removedBookId)
              await deleteBook(removedBookId);
              const updatedTableData = tableData.filter((_, i) => i !== index);
              setTableData(updatedTableData);
              showAlert('Book Removed', 'The book has been successfully removed.');
            } catch (error) {
              console.error('Error removing book:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <SwipeListView
        data={tableData}
        keyExtractor={item => item.id.toString()}

        renderItem={({ item, index }) => {
          return (
            <TouchableHighlight
              onPress={() => {
                navigation.navigate('UpdateDetails', { bookID: item.id });
              }}
              underlayColor="#DDDDDD"
            >
              <View style={styles.bookContainer}>
                <Image style={styles.image} source={{ uri: item.image }} />
                <View style={styles.bookInfo}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.author}>Author: {item.author}</Text>
                  <View style={styles.availableContainer}>
                    {item.availability ? (
                      <Text style={styles.available}>Available</Text>
                    ) : (
                      <Text style={styles.notAvailable}>Not Available</Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableHighlight>

          );
        }}
        renderHiddenItem={({ item, index }) => (
          <View style={styles.rowBack}>

            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}

              onPress={() => removeBook(index)}
            >
              <Text style={styles.backTextWhite}>Remove</Text>
            </TouchableOpacity >
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
      />

    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 2,
    padding: 10,
    borderColor: 'black',
    borderRadius: 2,
    justifyContent: 'space-between',
  },
  image: {
    height: 225,
    width: 155,
    borderRadius: 6,
  },
  bookInfo: {
    flex: 1,
    padding: 16,
    flexShrink: 1,
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'black',
    flexShrink: 1,
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: 'black',
  },
  availableContainer: {
    marginTop: 15,
  },
  available: {
    color: 'green',
    textAlign: 'left',
  },
  notAvailable: {
    color: 'red',
    textAlign: 'left',
  },
  rowBack: {
    alignItems: 'center',

    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 0,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,

  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
    margin: 2,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    margin: 2,
  },
  backTextWhite: {
    color: '#FFF',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  alertOption: {
    fontSize: 16,
    color: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: 'center',
  },

};

export default AdminBook;
