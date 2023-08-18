import React, {useEffect,useState} from "react";
import {View,Text,FlatList,StyleSheet} from "react-native";
import { getBookList } from "../services/BooksService";
import { Book } from "../components/Book";

export function BookList ({navigation}){
    function renderBook({item: book}){
        return(
            <Book
                {...book}
                onPress={()=>{
                    navigation.navigate("BookDetails",{ bookID: book.id}) /* bookID: book.id, userId: */
                }}
            />
        )
    }

    const [books, setBooks] = useState([]);

    useEffect(() => {
        getBookList()
          .then((books) => setBooks(books))
          .catch((error) => console.log('Error fetching books:', error));
      }, []);
      

    return(
        <FlatList
            style={styles.bookList}
            contentContainerStyle={styles.bookListContainer}
            keyExtractor={(item) => item.id.toString()}
            data={books}
            renderItem={renderBook}
        />
    )
}

const styles = StyleSheet.create({
    bookList: {
      backgroundColor: "#eeeeee",
    },
    bookListContainer: {
      backgroundColor: "#eeeeee",
      paddingVertical: 8,
      marginHorizontal: 8,
    },
  });