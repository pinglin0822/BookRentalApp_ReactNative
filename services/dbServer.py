import sqlite3
from flask import Flask, jsonify, request, abort
from flask_socketio import SocketIO, emit
from argparse import ArgumentParser

DB = 'bookRental.sqlite'

def get_book_row_as_dict(row):
    book_row_dict = {
        'id': row[0],
        'title': row[1],
        'image': row[2],
        'availability': row[3],
        'description': row[4],
        'author': row[5],
    }

    return book_row_dict

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode='eventlet')

@socketio.on('feedback')
def handle_feedback(message):
    # Process the feedback here (e.g., store it in a database, log it, etc.)
    print(f"Received feedback: {message}")

    # Send a response back to the sender
    response_message = "Feedback received successfully. Thanks for your feedback"
    emit('feedback_response', response_message)

@app.route('/api/signin', methods=['POST'])
def signin():
    if not request.json:
        abort(400)  # Bad request

    signin_detail = (
        request.json['email'],
        request.json['password']
    )

    if not signin_detail[0] or not signin_detail[1]:
        abort(400)  # Bad request

    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM user WHERE email = ? AND password = ?', signin_detail)
    row = cursor.fetchone()
    db.close()

    if row is None:
        abort(401)  # Unauthorized

    user_dict = {
        'id': row[0],
        'email': row[2],
        'type': row[4],  # Adjust this based on your database schema
    }

    return jsonify(user_dict), 200


@app.route('/api/users', methods=['POST'])
def insert_user():
    if not request.json:
        abort(400)  # Bad request

    new_user = (
        request.json['name'],
        request.json['email'],
        request.json['password'],
        request.json['type'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO user (name, email, password, type) VALUES (?, ?, ?, ?)
    ''', new_user)
    
    user_id = cursor.lastrowid
    db.commit()

    response = {
        'id': user_id,
        'message': 'User inserted successfully',
    }

    db.close()

    return jsonify(response), 201

@app.route('/api/books', methods=['GET'])
def index():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM books ORDER BY title')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    book_rows_as_dict = []
    for row in rows:
        book_row_as_dict = get_book_row_as_dict(row)
        book_rows_as_dict.append(book_row_as_dict)

    return jsonify(book_rows_as_dict), 200

@app.route('/api/books', methods=['POST'])
def store():
    if not request.json:
        abort(404)

    new_book = (
        request.json['title'],
        request.json['image'],
        request.json['availability'],
        request.json['description'],
        request.json['author'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO books(title,image,availability,description,author)
        VALUES(?,?,?,?,?)
    ''', new_book)

    book_id = cursor.lastrowid

    db.commit()

    response = {
        'id': book_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

@app.route('/api/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM books WHERE id = ?', (book_id,))
    row = cursor.fetchone()
    db.close()

    if row is None:
        abort(404)  # Book not found

    book_dict = get_book_row_as_dict(row)
    return jsonify(book_dict), 200

@app.route('/api/books/favorite/<int:book_id>', methods=['POST'])
def toggle_favorite_status(book_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()

    # Check if the book is already in favorites
    cursor.execute('SELECT * FROM favourite WHERE bookId = ?', (book_id,))
    row = cursor.fetchone()

    if row is not None:
        # Book is already in favorites, so remove it
        cursor.execute('DELETE FROM favourite WHERE bookId = ?', (book_id,))
        action = 'remove'
        result = cursor.rowcount
    else:
        # Book is not in favorites, so add it
        cursor.execute('INSERT INTO favourite (bookId) VALUES (?)', (book_id,))
        action = 'add'
        result = cursor.lastrowid

    db.commit()
    db.close()

    response = {
        'action': action,
        'result': result,
    }

    return jsonify(response), 200


@app.route('/api/isBookInFavorites/<int:book_id>', methods=['GET'])
def is_book_in_favorites(book_id):
    try:
        db = sqlite3.connect(DB)
        cursor = db.cursor()
        cursor.execute('SELECT * FROM favourite WHERE bookId = ?', (book_id,))
        row = cursor.fetchone()

        if row is None:
            db.close()
            return jsonify({'isInFavorites': False}), 200

        db.close()

        return jsonify({'isInFavorites': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/favoriteBooks', methods=['GET'])
def get_favorite_books():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT books.* FROM books INNER JOIN favourite ON books.id = favourite.bookId')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    book_rows_as_dict = []
    for row in rows:
        book_row_as_dict = get_book_row_as_dict(row)
        book_rows_as_dict.append(book_row_as_dict)

    return jsonify(book_rows_as_dict), 200

@app.route('/api/borrowBook', methods=['POST'])
def borrowBookFunction():
    if not request.json:
        abort(404)

    borrow_book = (
        request.json['bookId'],
        request.json['borrowDate'],
        request.json['returnDate'],
    )

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('''
        INSERT INTO borrowedBook (bookId, borrowDate, returnDate) VALUES (?, ?, ?)
    ''', borrow_book)

    book_id = cursor.lastrowid

    db.commit()

    response = {
        'id': book_id,
        'affected': db.total_changes,
    }

    db.close()

    return jsonify(response), 201

@app.route('/api/bookAvailability/<int:book_id>', methods=['GET'])
def get_book_Availability(book_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT availability FROM books WHERE id = ?', (book_id,))
    row = cursor.fetchone()
    db.close()

    if row is None:
        abort(404)  # Book not found

    book_dict = {'availability': row[0],}
    return jsonify(book_dict), 200

@app.route('/api/borrowedBooks', methods=['GET'])
def get_borrowed_books():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT borrowedBook.*, books.title, books.image, books.author FROM borrowedBook INNER JOIN books ON borrowedBook.bookId = books.id')
    rows = cursor.fetchall()

    print(rows)

    db.close()

    book_rows_as_dict = []
    for row in rows:
        book_row_as_dict ={
        'id': row[0],
        'bookId': row[1],
        'borrowDate': row[2],
        'returnDate': row[3],
        'title': row[4],
        'image': row[5],
        'author': row[6],
    }
        book_rows_as_dict.append(book_row_as_dict)

    return jsonify(book_rows_as_dict), 200

@app.route('/api/books/<int:book>', methods=['DELETE'])
def delete(book):
    if not request.json:
        abort(400, "Invalid request")

    if 'id' not in request.json or int(request.json['id']) != book:
        abort(400, "Invalid book ID")

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM books WHERE id=?', (str(book),))

    db.commit()

    db.close()

    return ('', 204)

@app.route('/api/favourite/<int:favourite>', methods=['DELETE'])
def deletefav(favourite):
    if not request.json:
        abort(400, "Invalid request")

    if 'id' not in request.json or int(request.json['id']) != book:
        abort(400, "Invalid favourite ID")

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM favourite WHERE id=?', (str(favourite),))

    db.commit()

    db.close()

    return ('', 204)

@app.route('/api/borrowedBook/<int:borrowedBook>', methods=['DELETE'])
def deleteborbook(borrowedBook):
    if not request.json:
        abort(400, "Invalid request")

    if 'id' not in request.json or int(request.json['id']) != borrowedBook:
        abort(400, "Invalid borrowed book ID")

    db = sqlite3.connect(DB)
    cursor = db.cursor()

    cursor.execute('DELETE FROM borrowedBook WHERE id=?', (str(borrowedBook),))

    db.commit()

    db.close()

    return ('', 204)

@app.route('/api/updateTitle/<int:book_id>', methods=['PUT'])
def update_title(book_id):
    try:
        data = request.get_json()
        new_title = data.get('newTitle')

        if new_title is None:
            abort(400, "Invalid data")

        db = sqlite3.connect(DB)
        cursor = db.cursor()
        cursor.execute('UPDATE books SET title = ? WHERE id = ?', (new_title, book_id))
        db.commit()
        db.close()

        return ('', 204)  # Success with no content
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/updateImage/<int:book_id>', methods=['PUT'])
def update_image(book_id):
    try:
        data = request.get_json()
        new_Image = data.get('newImage')

        if new_Image is None:
            abort(400, "Invalid data")

        db = sqlite3.connect(DB)
        cursor = db.cursor()
        cursor.execute('UPDATE books SET image = ? WHERE id = ?', (new_Image, book_id))
        db.commit()
        db.close()

        return ('', 204)  # Success with no content
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/updateAuthor/<int:book_id>', methods=['PUT'])
def update_author(book_id):
    try:
        data = request.get_json()
        new_Author = data.get('newAuthor')

        if new_Author is None:
            abort(400, "Invalid data")

        db = sqlite3.connect(DB)
        cursor = db.cursor()
        cursor.execute('UPDATE books SET author = ? WHERE id = ?', (new_Author, book_id))
        db.commit()
        db.close()

        return ('', 204)  # Success with no content
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/updateDesc/<int:book_id>', methods=['PUT'])
def update_Desc(book_id):
    try:
        data = request.get_json()
        new_Desc = data.get('newDescription')

        if new_Desc is None:
            abort(400, "Invalid data")

        db = sqlite3.connect(DB)
        cursor = db.cursor()
        cursor.execute('UPDATE books SET description = ? WHERE id = ?', (new_Desc, book_id))
        db.commit()
        db.close()

        return ('', 204)  # Success with no content
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/updateAvai/<int:book_id>', methods=['PUT'])
def update_Avai(book_id):
    try:
        data = request.get_json()
        newAvailability = data.get('newAvailability')

        if newAvailability is None:
            abort(400, "Invalid data")

        db = sqlite3.connect(DB)
        cursor = db.cursor()
        cursor.execute('UPDATE books SET availability = ? WHERE id = ?', (newAvailability, book_id))
        db.commit()
        db.close()

        return ('', 204)  # Success with no content
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    socketio.run(app, host='0.0.0.0', port=5000,debug='true')
    app.run(debug=True)