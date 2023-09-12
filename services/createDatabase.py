import sqlite3
db = sqlite3.connect('bookRentalApps.sqlite')

db.execute('''CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, image TEXT, availability INTEGER, description TEXT, author TEXT)''')
db.execute('''CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT, type TEXT)''')
db.execute('''CREATE TABLE IF NOT EXISTS borrowedBook (id INTEGER PRIMARY KEY AUTOINCREMENT, bookId INTEGER, borrowDate TEXT, returnDate TEXT)''')
db.execute('''CREATE TABLE IF NOT EXISTS favourite (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, bookId INTEGER)''')

cursor = db.cursor()

cursor.execute('''
    INSERT INTO books(title,image,availability,description,author)
    VALUES('BookA','imageA','1','description for book A','authorA')
''')

cursor.execute('''
    INSERT INTO books(title,image,availability,description,author)
    VALUES('BookB','imageB','1','description for book B','authorB')
''')

cursor.execute('''
    INSERT INTO user(name,email,password,type)
    VALUES('cpladmin','cpl@admin.com','password','Admin')
''')

cursor.execute('''
    INSERT INTO user(name,email,password,type)
    VALUES('cplclient','cpl@client.com','password','Client')
''')

db.commit()
db.close()