const express = require('express'),
      bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const imageUploadRoutes = require('./routes/image-upload');
const toolsRoutes = require('./routes/tools');
const profilesRoutes = require('./routes/profiles');
const messagesRoutes = require('./routes/messages');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  pingTimeout: 60000,
});

io.set('origins', '*:*');
io.on('connection', socket => {

  socket.on('SEND_CHAT_MESSAGE', function (data) {
    io.sockets.in(data.room_id).emit('RECEIVE_CHAT_MESSAGE', data);
  })

  socket.on('SEND_MESSAGE_TYPING_NOTIFICATION', function (data) {
    io.sockets.in(data.room_id).emit('RECEIVE_MESSAGE_TYPING_NOTIFICATION', data);
  })

  socket.on('SEND_NOTIFICATION', function (data) {
    io.emit('RECEIVE_NOTIFICATION', data)
  })

  socket.on('USER_CONNECTION', (login, roomToConnect) => {
    socket.username = username;
    socket.room = roomToConnect;
    socket.join(roomToConnect);
    io.emit('USER_CONNECTED', (login, room));
  })

  socket.on('disconnect', () => {
    socket.disconnect(); 
  })

  socket.on('CONNECT_TO_ROOM', function (room) {
    socket.room = room;
    socket.join(room);
  });

})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/upload', imageUploadRoutes);
app.use('/api/v1/tools', toolsRoutes);
app.use('/api/v1/profiles', profilesRoutes);
app.use('/api/v1/messages', messagesRoutes);

const PORT = process.env.PORT || 3001;

server.listen(PORT, function () {
  console.log('Server is running on port ' + PORT + ' ...')
});
