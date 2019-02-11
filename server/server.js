const express = require('express');
const mongoose = require('mongoose');
const user = require('./components/User');
var cors = require('cors');
var helmet = require('helmet');
var bodyParser = require('body-parser');
const path = require('path');
const app = express();

mongoose
  .connect('mongodb://localhost:27017/chatApp')
  .then(() => console.log('connected success to db'))
  .catch(() => console.error('there is error to connect with db'));

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use('/api/user', user.router);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../clinet/build'));

  app.get('*', (req, res) => {
    const pth = path.resolve(__dirname, '..', 'clinet', 'build', 'index.html');
    console.log(pth);

    res.sendFile(pth);
  });
}
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Users = [];
io.on('connection', function (socket) {
   
  socket.on('current', (user) => {
    const users = Users.filter(c=> c.id !== user._id)
    socket.emit('hello', users );
    const user_ = Users.find(c => c.id === user._id);
    if(user_){
      return;
    }
    Users.push({ id: user._id, socketId: socket.id, name: user.name });   
    socket.broadcast.emit('newOneComming', user);
  });


  socket.on('sendMessage', (obj) => {
    var result = Users.find(el => el.id === obj.to);
    var sendId = Users.find(el => el.socketId === socket.id);
    if (!result) {
      return;
    }
    const messageSend = { content: obj.content, from: sendId.id };
    io.to(result.socketId).emit('newMessageComming', messageSend);
  })



  socket.on('disconnect', () => {
    try{
    var index = Users.findIndex(item => item.socketId === socket.id)
    io.sockets.emit('disconnectOne',Users[index].id);
    Users.splice(index, 1);
    }catch(e){
    }
  })
  
});


server.listen(process.env.PORT || '8000', () =>
  console.log('sever lisent to port : 8000')
);
