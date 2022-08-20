const path = require("path");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile('index.html', {root: path.join(__dirname, './public')});
});

app.get('/receiver', function(req, res){
    res.sendFile('receiver.html', {root: path.join(__dirname, './public')});
});

app.get('/sender', function(req, res){
    res.sendFile('sender.html', {root: path.join(__dirname, './public')});
});

let users = 0;

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
    console.log('A user connected');

    socket.on('joinReceiver', function() {
        users++;
        socket.join('receiver');
    });

    socket.on('joinSender', function() {
        users++;
        socket.join('sender');
    });

    socket.on('message', function(msg) {
        socket.to("receiver").emit('message', msg);
    });

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        users--;
        console.log('A user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});