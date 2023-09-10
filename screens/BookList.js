import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput } from "react-native";
import { getBookList } from "../services/BooksService";
import { Book } from "../components/Book";

export function BookList({ navigation }) {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getBookList()
      .then((books) => setBooks(books))
      .catch((error) => console.log("Error fetching books:", error));
  }, []);

  // Function to handle changes in the search query
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Filter the book list based on the search query
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function renderBook({ item: book }) {
    return (
      <Book
        {...book}
        onPress={() => {
          navigation.navigate("BookDetails", { bookID: book.id });
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search books..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        numColumns={2} // Assuming you want to display books in two columns
        style={styles.bookList}
        contentContainerStyle={styles.bookListContainer}
        keyExtractor={(item) => item.id.toString()}
        data={filteredBooks} // Use the filtered book list
        renderItem={renderBook}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  bookList: {
    backgroundColor: "#eeeeee",
  },
  bookListContainer: {
    backgroundColor: "#eeeeee",
    paddingVertical: 8,
    marginHorizontal: 8,
  },
});
