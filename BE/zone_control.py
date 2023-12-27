import threading
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

f = open('user.txt', 'r')
username = ""
# while(True):
#     if(len(f.read())>0):
#         global username
#         username = 

username = f.read()

try:
    key = credentials.Certificate("key.json")  # admin key
    firebase_admin.initialize_app(
        key, {"databaseURL": "https://sprinkler-6d26c-default-rtdb.firebaseio.com/"+username+".json"}
    )  # figure out what happens when no wifi
    user_id = 0  # make this settable
    ref = db.reference("/" + username + "/zones")
    zone_data = ref.get()
    print(zone_data)
    num_zones = len(zone_data)
    print("num zones " + str(num_zones))
    zone_on = [zone_data[i]["is_on"] for i in range(num_zones)]

    def check_zones():
        t = threading.Timer(1.0, check_zones)
        t.start()
        ref = db.reference("/" + username + "/zones")
        zone_data = ref.get()
        for i in range(num_zones):
            if zone_data[i]["is_on"] != zone_on[i]:
                zone_on[i] = zone_data[i]["is_on"]
                toggle_zone(i)
            else:
                zone_on[i] = zone_data[i]["is_on"]

    t = threading.Timer(1.0, check_zones)
    t.start()

except ConnectionError as e:
    print("connection lost, resorting to default schedule")

    def see_if_internet_back():
        t = threading.Timer(1.0, see_if_internet_back)
        t.start()
        ref = db.reference("/1")
        # print("\nzone on?\n1: ", ref.get()[1], "\n2: ", ref.get()[2], "\n3: ", ref.get()[3], "\n4: ", ref.get()[4], "\n5: ", ref.get()[5])

    t = threading.Timer(1.0, check_zones)
    t.start()


# zones = [3,5,7,11,13,15,7,8,9,10,11,12,13,14,15,16,17,18,19,20] # lists gpio pins for each zone (index 0 is zone 1, etc.)


def toggle_zone(zone: int):
    # turn on gpio pin zones[zone-1]
    # zones[zone] = not zones[zone]
    if zone_on[zone]:
        print("zone ", zone, " is on")
    else:
        print("zone ", zone, " is off")
    # print("zone ", zone, " is ", ("on" if zone_on[zone] else "off"))
