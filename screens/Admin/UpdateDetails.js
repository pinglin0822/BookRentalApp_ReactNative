import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  TextInput,
  Modal,
  TouchableOpacity,
  Button,
  Switch
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getBook, updateTitle, updateAuthor, updateImage, updateDescription, updateAvailability } from '../../services/BooksService';
import { FloatingAction } from "react-native-floating-action";

export function UpdateDetails({ route, navigation }) {
  const { bookID } = route.params;
  const [book, setBook] = useState({});
  const [notification, setNotification] = useState({ message: '', isVisible: false });
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [availability, setAvailability] = useState(false);
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newAvailability, setNewAvailability] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [titleModalVisible, setTitleModalVisible] = useState(false);
  const [authorModalVisible, setAuthorModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);


  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const bookDetails = await getBook(bookID);
        setBook(bookDetails);

        setTitle(bookDetails.title);
        setImage(bookDetails.image);
        setAvailability(bookDetails.availability);
        setDescription(bookDetails.description);
        setAuthor(bookDetails.author);

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


  const actions = [
    {
      text: " Title",
      icon: require('../../icons/title.png'),
      name: "updateTitle",
      position: 1
    },
    {
      text: " Image",
      name: "updateImage",
      icon: require('../../icons/image.png'),
      position: 2
    },
    {
      text: " Author",
      name: "updateAuthor",
      icon: require('../../icons/author.png'),
      position: 4
    },
    {
      text: " Availability",
      name: "updateAvailability",
      icon: require('../../icons/availability.png'),
      position: 5,
    },
    {
      text: " Description ",
      name: "updateDescription",
      icon: require('../../icons/description.png'),
      position: 6,
    },
  ];

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
        setNewImage(imageUri);
      }
    });
  };

  const editTitle = async () => {
    setTitleModalVisible(true); // Show the modal for entering the new title
  };

  const editImage = async () => {
    setImageModalVisible(true); // Show the modal for entering the new title
  };

  const editAuthor = async () => {
    setAuthorModalVisible(true); // Show the modal for entering the new title
  };

  const editDescription = async () => {
    setDescriptionModalVisible(true); // Show the modal for entering the new title
  };

  const editAvailability = async () => {
    setAvailabilityModalVisible(true); // Show the modal for entering the new title
  };

  const updateBookTitle = async () => {
    try {
      await updateTitle(bookID, newTitle);
      Alert.alert('Success', 'Title updated successfully', [
        {
          text: 'OK', onPress: () =>
            setTitleModalVisible(false)
        },
      ]);
      setTitle(newTitle);
      setNewTitle('');
      setTitleModalVisible(false);

    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const updateBookImage = async () => {
    try {
      await updateImage(bookID, newImage);
      Alert.alert('Success', 'Image updated successfully', [
        {
          text: 'OK', onPress: () =>
            setImageModalVisible(false)
        },
      ]);
      setImage(newImage);
      setNewImage('');
      setImageModalVisible(false);

    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  const updateBookAuthor = async () => {
    try {
      await updateAuthor(bookID, newAuthor);
      Alert.alert('Success', 'Author updated successfully', [
        {
          text: 'OK', onPress: () =>
            setTitleModalVisible(false)
        },
      ]);
      setAuthor(newAuthor);
      setNewAuthor('');
      setAuthorModalVisible(false);

    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  const updateBookAvailability = async () => {
    try {
      // Call your service function to update the availability
      await updateAvailability(bookID, newAvailability);
      Alert.alert('Success', 'Availability updated successfully', [
        {
          text: 'OK', onPress: () =>
            setAvailabilityModalVisible(false)
        },
      ]);
      setAvailability(newAvailability);
      setNewAvailability('');
      setAvailabilityModalVisible(false);

    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const updateBookDescription = async () => {
    try {
      // Call your service function to update the description
      await updateDescription(bookID, newDescription);
      Alert.alert('Success', 'Title updated successfully', [
        {
          text: 'OK', onPress: () =>
            setDescriptionModalVisible(false)
        },
      ]);
      setDescription(newDescription);
      setNewDescription('');
      setDescriptionModalVisible(false);

    } catch (error) {
      console.error('Error updating description:', error);
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
          <View style={styles.availableContainer}>
            <Text style={styles.descriptionHeader}>Availability:</Text>
            {book.availability ? (
              <Text style={styles.available}>Available</Text>
            ) : (
              <Text style={styles.notAvailable}>Not Available</Text>
            )}
          </View>
        </View>


        {/*Modal for Title */}
        <Modal animationType="slide" transparent={true} visible={titleModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Enter new title"
                onChangeText={(text) => setNewTitle(text)}
                value={newTitle}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={updateBookTitle}
              >
                <Text style={styles.modalButtonText}>Update Title</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setTitleModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*Modal for Image */}
        <Modal animationType="slide" transparent={true} visible={imageModalVisible}>
          {newImage && (
            <Image
              source={{ uri: newImage }}
              style={{ flex: 1 }}
              resizeMode="contain"
            />
          )}
          <View style={styles.modalContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white', margin: 10 }}>Update Title</Text>

            <View style={{ margin: 10 }}>
              <Button title="Upload Image" onPress={openImagePicker} />
            </View>
            <View style={{ margin: 10 }}>

              <Button
                title="Confirm"
                style={styles.modalButton}
                onPress={updateBookImage}
              />
            </View>

            <Button
              title="Cancel"
              style={styles.modalButton}
              onPress={() => setImageModalVisible(false)}
            />

          </View>
        </Modal>

        {/*Modal for Author */}
        <Modal animationType="slide" transparent={true} visible={authorModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Enter new Author"
                onChangeText={(text) => setNewAuthor(text)}
                value={newAuthor}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={updateBookAuthor}
              >
                <Text style={styles.modalButtonText}>Update Author</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setAuthorModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*Modal for Description */}
        <Modal animationType="slide" transparent={true} visible={descriptionModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Enter new Description"
                onChangeText={(text) => setNewDescription(text)}
                value={newDescription}
              />
              <TouchableOpacity
                style={styles.modalButton}
                onPress={updateBookDescription}
              >
                <Text style={styles.modalButtonText}>Update Description</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setDescriptionModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/*Modal for Availability */}
        <Modal animationType="slide" transparent={true} visible={availabilityModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.switchContainer}>
                <Text style={styles.availabilityText}>Available:</Text>
                <Switch value={newAvailability} onValueChange={(value) => setNewAvailability(value)} />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={updateBookAvailability}
                >
                  <Text style={styles.modalButtonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setAvailabilityModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <FloatingAction
          actions={actions}
          onPressItem={name => {
            switch (name) {
              case 'updateTitle':
                editTitle();
                break;
              case 'updateImage':
                editImage();
                break;
              case 'updateAuthor':
                editAuthor();
                break;
              case 'updateAvailability':
                editAvailability();
                break;
              case 'updateDescription':
                editDescription();
                break;
            }
          }}
        />


      </ScrollView>
    </SafeAreaView >
  );
}


const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: '0',
  },
  image: {
    height: 300,
    width: '100%',
    aspectRatio: 1,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: '10%',
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
  availableContainer: {
    marginTop: 15,
  },
  available: {
    fontSize: 20,
    color: 'green',
    textAlign: 'left',
  },
  notAvailable: {
    fontSize: 20,
    color: 'red',
    textAlign: 'left',
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
});

export default UpdateDetails;