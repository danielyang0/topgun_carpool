# topgun_carpool    
moved to https://github.com/leejuqiang/sideProject-carpool.git

To run the jar, use command line    
java -cp carpool.jar topgun.carpool.Main    

*.json file is the data supposed to be in database. For testing, please add necessary data to the json files as the given format in those files.   

Config.txt:  
Keys started with cmd means they're the path of a post request. For test communication with server, make sure the ajax post in js use the same path as each command.  
The protocol includes for now all the keys for data posted to server. The array named keys is the key name used in server, so you should set the key name used in client in the values array to map the keys in server. Here is the meaning of each key:  
userName: string, The user id  
isDriver: bool, if the use is a driver  
latitude: double, the latitude  
longitude: double, the longitude  
number: int, the total number of the seats of a driver or the passengers of a passenger  
available: int, the available number of the seats of a driver or the passengers of passenger  
time: long, the time stamp of the date  
sender: string, the user id of the sender of an invitation  
to: string, the user id of the receiver of an invitation  
accept: bool, if the invitation is accepted  
password: string, the password of a user  
post: dictionary, the post information of a user  
invites: array, the invitation a user has received   


