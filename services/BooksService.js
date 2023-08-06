import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

const createTable = () => {
    db.transaction((tx) => {
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
        'CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT, type TEXT)',
        [],
        () => {
          console.log('Table created successfully');
        },
        (error) => {
          console.log('Error creating categories table:', error);
        }
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS borrowedBook (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, bookId INTEGER, borrowDate TEXT, returnDate TEXT)',
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