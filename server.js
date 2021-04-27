const express = require('express');
const app = express();                      //Creating or initializing a app using express
const server = require('http').Server(app); //Creating a server using http module and initializing it to our App
const io = require('socket.io')(server);    //passing server to the return of this require function
const { v4: uuidV4 } = require('uuid');     //importing uuid module as uuidV4

app.set('view engine', 'ejs');              //It is a simple templating language/engine that lets its user generate HTML with plain javascript
app.use(express.static('public'));          //serving the static files present in the public folder of the App

app.get('/', (req, res) => {                                //route to create a new room and redirect the user to that room
    res.redirect(`${uuidV4()}`)
});

app.get('/:room', (req, res) => {                           //routes for rendering a room
    res.render('room', { roomId: req.params.room });        //rendering a engine stored in a variable 'room' and passing a parameter roomId from Parameterized URL
})

io.on('connection', socket => {                             //Creating a connection using socket.io
    socket.on('join-room', (roomId, userId) => {            //setting up an event which happens to run whenever someone enters the room
        socket.join(roomId);                                //send roomId to client side
        socket.to(roomId).emit('user-connected', userId)    //event which sends a message to the room whenever a user join that same room
    })
})

server.listen(3000, () => {                 //listen to a port 3000
    console.log("server's running");
});