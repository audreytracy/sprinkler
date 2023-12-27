from flask import Flask, request
import firebase_admin
from firebase_admin import credentials, db
import requests

app = Flask(__name__)
app.static_folder = 'static'


@app.route('/')
def index():
    return '''
    <html>
        <head>
            <link rel="stylesheet" type="text/css" href="static/styles.css" />
        </head>
        <body>
            <p>Connect Account</p>
            <form action="/submit" method="post">
                <p><input type="text" name="email" placeholder = "email@example.com" class = "input"/></p>
                <p><input type="password" name="password" placeholder = "password" class = "input"/></p>
                <p class = "justify-right" ><input type="submit" value="login" class="button"/></p>
            </form>
        </body>
    </html>
    '''

def get_uid(email: str, password: str):
    url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"
    api_key = "AIzaSyB1XKZdKGpsRPvoRioJVgnQ1MdFSsayXEU"
    email_and_password = {
        "email": email,
        "password": password,
        "returnSecureToken": True
    }
    data = requests.post(url, params={"key": api_key}, json=email_and_password).json()
    if "localId" in data:
        return data["localId"]
    elif "error" in data:
        return None

@app.route('/submit', methods=['POST'])
def submit():
    email = request.form["email"]
    password = request.form["password"]
    uid = get_uid(email, password)
    if(uid == None):
        return '''
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="static/styles.css" />
            </head>
            <body>
                <p>Connect Account</p>
                <form action="/submit" method="post">
                    <p><input type="text" name="email" placeholder = "invalid login" class = "input"/></p>
                    <p><input type="password" name="password" placeholder = "invalid login" class = "input"/></p>
                    <p class = "justify-right" ><input type="submit" value="login" class="button"/></p>
                </form>
            </body>
        </html>
        '''
            
    # user = auth.get_user(uid)
    # username = user.email
    ref = db.reference("/" + uid)
    ref.update({'has_connected_device' : True})

    f = open('user.txt', 'w')
    f.write(uid)
    return "Successfully set up device for user " + email

if __name__ == '__main__':
    key = credentials.Certificate("key.json")  # admin key
    firebase_admin.initialize_app(
        key, {"databaseURL": "https://sprinkler-6d26c-default-rtdb.firebaseio.com"}
    ) 
    app.run(debug=True, host='0.0.0.0')
