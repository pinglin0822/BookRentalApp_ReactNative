import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, TextInput, ScrollView, Image, Switch, FlatList } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { getBookList, deleteBook, updateTitle, updateAuthor, updateDescription, updateAvailability } from '../../services/BooksService';

const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

const AdminBook = ({image}) => {
  const [tableData, setTableData] = useState([]);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBookIndex, setSelectedBookIndex] = useState(null);
  const [updateOption, setUpdateOption] = useState('');
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  const [customOptions, setCustomOptions] = useState([]);
  const [availability, setAvailability] = useState(false);

  useEffect(() => {
    fetchDataFromDatabase();
  }, []);

  const fetchDataFromDatabase = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id, title, author, description, availability FROM books',
        [],
        (_, result) => {
          const fetchedData = [];
          for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            fetchedData.push({
              id: row.id,
              title: row.title,
              author: row.author,
              description: row.description,
              availability: row.availability,
            });
          }
          setTableData(fetchedData);
        },
        (_, error) => {
          console.log('Error fetching data:', error);
        }
      );
    });
  };

  const updateBook = index => {
    const options = ['Title', 'Author', 'Description', 'Availability'];
  
    const customOptions = options.map((option, optionIndex) => ({
      text: option,
      onPress: () => handleUpdateOption(optionIndex, index),
    }));
  
    setCustomOptions(customOptions);
    setIsCustomModalVisible(true);
  };

  const handleUpdateOption = (optionIndex, bookIndex) => {
  const updateOptions = ['title', 'author', 'description', 'availability'];
  setSelectedBookIndex(bookIndex);
  setUpdateOption(updateOptions[optionIndex]);
  setIsCustomModalVisible(false);
  setIsModalVisible(true);
};

  const updateAttribute = async (bookIndex, newValue) => {
    try {
      const bookId = tableData[bookIndex].id;
      switch (updateOption) {
        case 'title':
          await updateTitle(bookId, newValue);
          updateTableData(bookIndex, [newTitleInput, 2]);
          break;
        case 'author':
          await updateAuthor(bookId, newValue);
          updateTableData(bookIndex, [newTitleInput, 2]);
          break;
        case 'description':
          await updateDescription(bookId, newValue);
          updateTableData(bookIndex, [newTitleInput, 3]);
          break;
        case 'availability':
          await updateAvailability(bookId, availability);
          updateTableData(bookIndex, [availability === 1 ? 'Available' : 'Not Available', 4]);
          setAvailability(false);
          break;
        default:
          break;
      }
      closeModalAndClearInput();
      showAlert(`${capitalize(updateOption)} Updated`, `The ${updateOption} has been successfully updated.`);
    } catch (error) {
      console.error('Error updating attribute:', error);
    }
  };

  const updateTableData = (bookIndex, newData) => {
    const updatedTableData = tableData.map((rowData, index) => {
      if (index === bookIndex) {
        return { ...rowData, [newData[1]]: newData[0] };
      }
      return rowData;
    });
    setTableData(updatedTableData);
  };

  const closeModalAndClearInput = () => {
    setIsModalVisible(false);
    setNewTitleInput('');
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
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



  function renderItem  ({ item: book, index  })  {
    return(

    <View style={styles.bookContainer}>
      <Image style={styles.image} source={image} />
        <View style={styles.bookInfo}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>Author: {book.author}</Text>
          <Text style={styles.description}>Description: {'\n'}{book.description}</Text>
          <View style={styles.availableContainer}>
                {book.availability ? (
                    <Text style={styles.available}>Available</Text>
                ) : (
                    <Text style={styles.notAvailable}>Not Available</Text>
                )}
            </View>
        </View>

        <TouchableOpacity onPress={() => updateBook(index)}>
        <View style={styles.update}>
          <Text style={styles.updateButton}>Update</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeBook(index)}>
        <View style={styles.remove}>
          <Text style={styles.removeButton}>Remove</Text>
        </View>
      </TouchableOpacity>
    </View>
    )

  }
 
  
   return (
    <View style={styles.container}>
       <ScrollView>
        <FlatList
        numColumns={2}
          data={tableData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      </ScrollView>

      <Modal
        visible={isModalVisible}
        onRequestClose={() => closeModalAndClearInput()}
        transparent={true}
      >
        <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {updateOption === 'availability' ? (
            <View style={styles.switchContainer}>
               <Text style={styles.availabilityText}>Available:</Text>
              <Switch value={availability} onValueChange={(value) => setAvailability(value)} />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => updateAttribute(selectedBookIndex, newTitleInput)}
              >
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => closeModalAndClearInput()}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.modalTitle}>{`Update ${capitalize(updateOption)}:`}</Text>
              <TextInput
                style={styles.input}
                value={newTitleInput}
                onChangeText={(text) => setNewTitleInput(text)}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => updateAttribute(selectedBookIndex, newTitleInput)}
              >
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => closeModalAndClearInput()}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        </View>
      </Modal>

     
      <Modal
        visible={isCustomModalVisible}
        onRequestClose={() => setIsCustomModalVisible(false)}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {customOptions.map((option, optionIndex) => (
              <TouchableOpacity
                key={option.text}
                style={styles.alertOption}
                onPress={() => {
                  option.onPress();
                  setIsModalVisible(true); 
                  setIsCustomModalVisible(false); 
                }}
              >
                <Text>{option.text}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsCustomModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  bookContainer:{
    width: '48%',
    alignItems: 'center',
    elevation: 2,
    margin: '1%',
    padding: 15,
  },
  image: {
    height:150,
    width:150,
    aspectRatio: 1,
    borderRadius:26
  },
  infoContainer: {
    padding: 16,
    flexShrink:1,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color:'black',
    flexShrink:1,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color:'black'
  },
  availableContainer:{
    marginTop: 15
  },
  available: {
    color:'green',
    textAlign:'center',
  },
  notAvailable: {
    color:'red',
    textAlign:'center',
  },  
  update:{
    elevation: 8,
    backgroundColor: '#279EFF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop:20,
  },
  updateButton:{
    color: 'white',
  },
  remove:{
    elevation: 8,
    backgroundColor: '#F6635C',
    borderRadius: 10,
    margin:5,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  removeButton:{
    color: 'white',
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
    color: 'blue', // Change the color to your desired value
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  
};

export default AdminBook;
