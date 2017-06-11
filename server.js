var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/static"));

app.get('/', function(req,res){
    res.render('index');
});


var server = app.listen(6789, function(){
    console.log('Listening on port 6789');
});

var io = require('socket.io').listen(server);

var users = [];
var messages = []; 

io.sockets.on('connection',function(socket){
    console.log('We are using sockets!');
    socket.on('got_a_new_user',function(data){
        var new_user_message = data.name + " is online."
        socket.broadcast.emit('new_user',{response:new_user_message});
        socket.emit('load_history', {users:users, messages:messages});
    })
    socket.on('got_a_new_message',function(data){
        console.log(users)
        users.push(data.info.name);
        messages.push(data.info.message);
        io.emit('display_all_message', {users:users, messages:messages});
    })

})