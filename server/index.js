const express = require('express'),
  bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const imageUploadRoutes = require('./routes/image-upload');
const toolsRoutes = require('./routes/tools');
const profilesRoutes = require('./routes/profiles');
const messagesRoutes = require('./routes/messages')

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.set('origins', '*:*');
io.on('connection', socket => {
  // console.log('Unknown user connected');

  socket.on('SEND_CHAT_MESSAGE', function (data) {
    // console.log(data);
    io.emit('RECEIVE_CHAT_MESSAGE', data);
  })

  socket.on('USER_CONNECTION', (login, roomToConnect) => {
    socket.username = username;
    socket.room = roomToConnect;
    socket.join(roomToConnect);
    // console.log(data);
    io.emit('USER_CONNECTED', (login, room));
  })

  socket.on('disconnect', () => {
    // console.log('Unknown user disconnected')
  })

  socket.on('SWITCH_ROOM', function (login, newRoom) {
    if (socket.room) {
      socket.leave(socket.room);
      console.log(login + " left " + socket.room);
    }
    socket.join(newRoom);
    socket.room = newRoom;
    console.log(login + " joined " + newRoom);
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
