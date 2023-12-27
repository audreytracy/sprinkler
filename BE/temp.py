from flask import Flask, redirect, url_for, request
import bcrypt
import threading
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db, auth

app = Flask(__name__)

@app.route('/')
def index():
    return '''
    <html>
       <body>
          <form action="/submit" method="post">
             <p>username:</p>
             <p><input type="text" name="username" /></p>
             <p>password:</p>
             <p><input type="password" name="password" /></p>
             <p><input type="submit" value="submit" /></p>
          </form>
       </body>
    </html>
    '''

@app.route('/<uid>')
def submit(uid:str):
    # # username = request.form["username"]
    # # password = request.form["password"] # access db, test if password is correct hash
    
    # # ref = db.reference("/" + username + "/pwd_hash")
    # # actual_pass_hash = ref.get()
    # # print(actual_pass_hash)
    # # is_correct = bcrypt.checkpw(password.encode('utf-8'), actual_pass_hash.encode('utf-8'))
    # # if(is_correct):

    # uid = request.form["username"]
    # uid = 'user-uid-goes-here'
    user = auth.get_user(uid)
    username = user.email

    f = open('user.txt', 'w')
    f.write(username)
    return user.email
    # return 'Got it, bud!'
    # return '''
    # <html>
    #    <body>
    #       invalid password
    #       <form action="/" method="post">
    #          <p><input type="submit" value="back to sign in" /></p>
    #       </form>
    #    </body>
    # </html>
    # '''

if __name__ == '__main__':
    key = credentials.Certificate("key.json")  # admin key
    firebase_admin.initialize_app(
        key, {"databaseURL": "https://sprinkler-6d26c-default-rtdb.firebaseio.com"}
    ) 
    app.run(debug=True, host='0.0.0.0')
