import SQLite from 'react-native-sqlite-storage';
import { SERVER_URL } from '../config.js';

const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

const createTable = () => {console.log('...');};

export { createTable };

export function signInUser(email, password) {
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL+'/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error('Invalid email or password.');
        } else {
          throw new Error('Error signing in.');
        }
      })
      .then((user) => {
        resolve(user); // Resolve with the user object, including userType
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function insertUser(name, email, password, type) {
  const newUser = {
    name, email, password, type
  };
  return fetch(SERVER_URL+'/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });
}



export function insertBook(newBook) {
  return fetch(SERVER_URL+'/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBook),
  });
}

export function getBookList() {
  return fetch(SERVER_URL+"/api/books")
  .then((response) => response.json())
}

export function getBook(id) {
  return fetch(SERVER_URL+"/api/books/"+id)
  .then((response) => response.json())
}

export function toggleBookFavoriteStatus(bookId) {
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL+`/api/books/favorite/${bookId}`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Error toggling favorite status.');
        }
      })
      .then((data) => {
        resolve(data); // Resolve with the action and result
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function isBookInFavorites(bookId) {
  return fetch(SERVER_URL + '/api/isBookInFavorites/' + bookId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => response.json())
  .then((data) => {
    return data.isInFavorites;
  });
}



export function getFavoriteBooks() {
  return fetch(SERVER_URL+"/api/favoriteBooks")
  .then((response) => response.json())
}

export function borrowBook(bookId, borrowDate, returnDate) {
  const newBook = {
    bookId, borrowDate, returnDate
  };
  console.log(borrowDate+','+returnDate)
  return fetch(SERVER_URL+'/api/borrowBook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBook),
  });
}

export function checkBookAvailability(bookId) {
  return fetch(SERVER_URL+"/api/bookAvailability/"+bookId)
  .then((response) => response.json())
  .then((data) => {
    return data.availability;
  });
}

export function getBorrowedBooks() {
  return fetch(SERVER_URL+"/api/borrowedBooks")
  .then((response) => response.json())
}

export function getBorrowedBooksone(bookId) {
  return fetch(SERVER_URL+"/api/borrowedBooks/"+bookId)
  .then((response) => response.json())
}

export function deleteBook(bookId) {
  return fetch(SERVER_URL+`/api/books/`+bookId, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: bookId }),
  });
}

export function removeFavouriteBook(favid) {
  return fetch(SERVER_URL+`/api/favourite/`+favid, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: favid }),
  });
}

export function updateTitle(bookId, newTitle) {
  return fetch(SERVER_URL+`/api/updateTitle/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newTitle: newTitle }),
  });
}

export const updateImage = (bookId, newImage) => {
  return fetch(SERVER_URL+`/api/updateImage/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newImage: newImage }),
  });
};

export function updateAuthor(bookId, newAuthor) {
  return fetch(SERVER_URL+`/api/updateAuthor/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newAuthor: newAuthor }),
  });
}

export function updateDescription(bookId, newDescription) {
  return fetch(SERVER_URL+`/api/updateDesc/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newDescription: newDescription }),
  });
}

export function updateAvailability(bookId, newAvailability) {
  console.log(newAvailability);
  return fetch(SERVER_URL+`/api/updateAvai/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newAvailability: newAvailability }),
  });
}

export function removeBorrowedBook(bookId) {
  return fetch(SERVER_URL+`/api/borrowedBook/`+bookId, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: bookId }),
  });
}