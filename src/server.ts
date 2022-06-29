
import http from 'http';
import express, { Express } from 'express';
import 'dotenv/config';
import path from 'path';

require('dotenv').config()

const translatorBOT = require('./service/app');
const { qwertyArray } = require('./service/keyBoard');

const routes = require('./routes/route');
const router: Express = express();

let connections: any[] = [];

router.use(express.static(path.join(__dirname, 'public')));
router.set('views', path.join(__dirname, 'views'));

router.engine('html', require('ejs').renderFile);
router.set('view engine', 'ejs');

router.use(express.static(path.join(__dirname, 'public')));

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/** Routes */
router.use('/', routes);

router.use((req, res) => {
    res.status(404).send("Sorry can't find that!")
})  
  
const httpServer = http.createServer(router);

const io = require('socket.io')(httpServer);
const room = "abc123";

let count = 0;

io.sockets.on('connection', function(socket: any) {
  console.log("Connected");
  connections.push(socket);

  socket.on('create', function (room:any) {
    count += 1;
    if (count == 1){
      socket.join(room);
      console.log('One user');
      socket.emit('created', room);
    } else if (count == 2) {
      io.sockets.in(room).emit('join', room);
      console.log('Two users');
      socket.join(room);
      socket.emit('joined', room);
    } else {
      socket.emit('full', room);
    }
  });
  
  socket.on('disconnect', function(data: any) {
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected");
  });
  
  socket.on('send mess', function(data: any) {
    if (data.permissionLevel == 'newby') {
      let result = translatorBOT(qwertyArray, data.mess);
      io.sockets.in(room).emit('add mess', {mess: result, name: data.name, permissionLevel: data.permissionLevel, className: data.className});
    } else {
      io.sockets.in(room).emit('add mess', {mess: data.mess, name: data.name, className: data.className});
    }
  });



});

const PORT: any = process.env.PORT;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

module.exports = {
    httpServer
}
