import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import SQLite from 'react-native-sqlite-storage';
import { deleteBook, updateTitle, updateAuthor, updateDescription, updateAvailability } from '../../services/BooksService';

const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

const AdminBook = () => {
  const [tableHead, setTableHead] = useState(['Book ID', 'Book Title', 'Author', 'Description', 'Availability', 'Update', 'Remove']);
  const [tableData, setTableData] = useState([]);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBookIndex, setSelectedBookIndex] = useState(null);
  const [updateOption, setUpdateOption] = useState('');
  const [isCustomModalVisible, setIsCustomModalVisible] = useState(false);
  const [customOptions, setCustomOptions] = useState([]);

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
            fetchedData.push([row.id, row.title, row.author, row.description, row.availability]);
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
      const bookId = tableData[bookIndex][0];
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
          await updateAvailability(bookId, newValue);
          updateTableData(bookIndex, [newValue === 1 ? 'Available' : 'Not Available', 4]);
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
        return [...rowData.slice(0, newData[1]), newData[0], ...rowData.slice(newData[1] + 1)];
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
              const removedBookId = tableData[index][0];
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

  const updateElement = (data, index) => (
    <TouchableOpacity onPress={() => updateBook(index)}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>Update</Text>
      </View>
    </TouchableOpacity>
  );

  const removeElement = (data, index) => (
    <TouchableOpacity onPress={() => removeBook(index)}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>Remove</Text>
      </View>
    </TouchableOpacity>
  );

  const availabilityElement = (availability) => {
    return (
      <View style={styles.dot}>
        <View style={availability === 1 ? styles.greenDot : styles.redDot} />
      </View>
    );
  };

   return (
    <View style={styles.container}>
      <ScrollView vertically>

      <ScrollView horizontal>
      <Table borderStyle={{ borderColor: 'transparent' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        {tableData.map((rowData, index) => (
          <TableWrapper key={index} style={styles.row}>
            {[...rowData.slice(0, 4), availabilityElement(rowData[4]), updateElement(null, index), removeElement(null, index)].map((cellData, cellIndex) => (
              <Cell key={cellIndex} data={cellData} textStyle={styles.text} />
            ))}
          </TableWrapper>
        ))}
      </Table>

      </ScrollView>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        onRequestClose={() => closeModalAndClearInput()}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {updateOption === 'Availability' && (
              <View style={styles.switchContainer}>
                <Text style={styles.availabilityText}>Available:</Text>
                <Switch value={availability} onValueChange={setAvailability} />
              </View>
            )}
            {updateOption && (
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
  container: { flex: 1, flexShrink:1, backgroundColor: '#fff' },
  head: { height: 50, backgroundColor: '#808B97' },
  text: {fontSize:10, margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1', padding:10 },
  btn: { width: 40, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
  btnText: { fontSize:10, textAlign: 'center', color: '#fff' },
  dot: { width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  greenDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'green' },
  redDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'red' },
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
