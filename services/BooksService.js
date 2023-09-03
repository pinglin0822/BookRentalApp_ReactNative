import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT, type TEXT)',
        [],
        () => {
          console.log('Table created successfully');
        },
        (error) => {
          console.log('Error creating categories table:', error);
        }
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, image TEXT, availability INTEGER, description TEXT, author TEXT)',
        [],
        () => {
          console.log('Table created successfully');
        },
        (error) => {
          console.log('Error creating table:', error);
        }
      );
      
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS borrowedBook (id INTEGER PRIMARY KEY AUTOINCREMENT, bookId INTEGER, borrowDate TEXT, returnDate TEXT)',
        [],
        () => {
          console.log('Table created successfully');
        },
        (error) => {
          console.log('Error creating categories table:', error);
        }
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS favourite (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, bookId INTEGER)',
        [],
        () => {
          console.log('Table created successfully');
        },
        (error) => {
          console.log('Error creating categories table:', error);
        }
      );
    });
  };
  
  export { createTable };
  
  export function signInUser(email, password) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM users WHERE email = ? AND password = ?',
          [email, password],
          (_, result) => {
            if (result.rows.length === 1) {
              const user = result.rows.item(0);
              resolve(user); // Resolve with the user object, including userType
            } else {
              reject(new Error('Invalid email or password.'));
            }
          },
          (_, error) => {
            reject(new Error(`Error fetching user: ${error.message}`));
          }
        );
      });
    });
  }
  
  
  
  export function insertUser(name, email, password, type) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)',
          [name, email, password, type],
          (_, result) => {
            resolve(result.insertId);
          },
          (_, error) => {
            console.error('Error during user insertion:', error.message); // Log the SQLite error message
            reject(error);
          }
        );
      });
    });
  }
  
  
  
  
  
  

  export function insertBook(book) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO books (title, image, availability, description, author) VALUES (?, ?, ?, ?, ?)',
          [book.title, book.image, book.availability ? 1 : 0, book.description, book.author],
          (_, result) => {
            resolve(result.insertId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function getBookList() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM books',
          [],
          (_, result) => {
            const books = [];
            for (let i = 0; i < result.rows.length; i++) {
              books.push(result.rows.item(i));
            }
            resolve(books);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }
  
  export function getBook(id) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM books WHERE id = ?',
          [id],
          (_, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows.item(0));
            } else {
              reject(new Error('Book not found'));
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function toggleBookFavoriteStatus(bookId) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM favourite WHERE bookId = ?',
          [bookId],
          (_, result) => {
            if (result.rows.length > 0) {
              // Book is already in favorites, so remove it
              tx.executeSql(
                'DELETE FROM favourite WHERE bookId = ?',
                [bookId],
                (_, deleteResult) => {
                  resolve({ action: 'remove', result: deleteResult });
                },
                (_, error) => {
                  reject(error);
                }
              );
            } else {
              // Book is not in favorites, so add it
              tx.executeSql(
                'INSERT INTO favourite (bookId) VALUES (?)',
                [bookId],
                (_, insertResult) => {
                  resolve({ action: 'add', result: insertResult });
                },
                (_, error) => {
                  reject(error);
                }
              );
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }


  export function isBookInFavorites(bookId) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM favourite WHERE bookId = ?',
          [bookId],
          (_, result) => {
            resolve(result.rows.length > 0);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }


  export function getFavoriteBooks() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT books.* FROM books INNER JOIN favourite ON books.id = favourite.bookId',
          [],
          (_, result) => {
            const favoriteBooks = [];
            for (let i = 0; i < result.rows.length; i++) {
              favoriteBooks.push(result.rows.item(i));
            }
            resolve(favoriteBooks);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function borrowBook(bookId, borrowDate, returnDate) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO borrowedBook (bookId, borrowDate, returnDate) VALUES (?, ?, ?)',
          [bookId, borrowDate, returnDate],
          (_, result) => {
            resolve(result.insertId);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }
  
  export function checkBookAvailability(bookId) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT availability FROM books WHERE id = ?',
          [bookId],
          (_, result) => {
            if (result.rows.length > 0) {
              const availability = result.rows.item(0).availability;
              resolve(availability === 1); // 1 represents available, 0 represents not available
            } else {
              reject(new Error('Book not found'));
            }
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function getBorrowedBooks() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT borrowedBook.*, books.title, books.image, books.author FROM borrowedBook INNER JOIN books ON borrowedBook.bookId = books.id',
          [],
          (_, result) => {
            const borrowedBooks = [];
            for (let i = 0; i < result.rows.length; i++) {
              borrowedBooks.push(result.rows.item(i));
            }
            resolve(borrowedBooks);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function deleteBook(bookId) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM books WHERE id = ?',
          [bookId],
          (_, result) => {
            resolve(result.rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function removeFavouriteBook(bookId) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM favourite WHERE id = ?',
          [bookId],
          (_, result) => {
            resolve(result.rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function updateTitle(bookId, newTitle) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE books SET title = ? WHERE id = ?',
          [newTitle, bookId],
          (_, result) => {
            resolve(result.rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function updateAuthor(bookId, newAuthor) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE books SET author = ? WHERE id = ?',
          [newAuthor, bookId],
          (_, result) => {
            resolve(result.rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function updateDescription(bookId, newDescription) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE books SET description = ? WHERE id = ?',
          [newDescription, bookId],
          (_, result) => {
            resolve(result.rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function updateAvailability(bookId, newAvailability) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE books SET availability = ? WHERE id = ?',
          [newAvailability, bookId], 
          (_, result) => {
            console.log('Rows affected:', result.rowsAffected);
            resolve(result.rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }

  export function removeBorrowedBook(bookId) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM borrowedBook WHERE id = ?',
          [bookId],
          (_, result) => {
            resolve(result.rowsAffected);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  }