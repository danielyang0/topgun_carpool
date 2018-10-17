var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true}));

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./localStorage');

var name;




/*  GET and POST requests*/

app.get('/', function(req, res) {
    console.log("Got a GET request for leaderboard.");
    res.sendFile(__dirname + "/googleMapDemo.html");
});

app.get('/', function(req, res) {
    console.log("Got a GET request for about.");
    res.sendFile(__dirname + "/googleMapDemo.html");
});

/* Server stuff */

var server = app.listen(8080, function(){
    var host = server.address().address
    var port = server.address().port

    console.log("listening at http://%s:%s", host, port)
});
