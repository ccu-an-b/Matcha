const express = require('express'),
  bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const imageUploadRoutes = require('./routes/image-upload');
const toolsRoutes = require('./routes/tools');
const profilesRoutes = require('./routes/profiles');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.set('origins', '*:*');
io.on('connection', socket => {

  socket.on('SEND_MESSAGE', function(data) {
    console.log(data);
    io.emit('RECEIVE_MESSAGE', data);
})

socket.on('SEND_USER', function(data) {
  console.log(data);
    io.emit('RECEIVE_USER', data);
})

  console.log('User connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/upload', imageUploadRoutes);
app.use('/api/v1/tools', toolsRoutes);
app.use('/api/v1/profiles', profilesRoutes);
const PORT = process.env.PORT || 3001;

server.listen(PORT, function () {
  console.log('Server is running on port ' + PORT + ' ...')
});
