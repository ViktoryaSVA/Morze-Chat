
import http from 'http';
import express, { Express } from 'express';
import 'dotenv/config';
import path from 'path';

require('dotenv').config()

const routes = require('./routes/route');
const translatorBOT = require('./service/app');
const { qwertyArray } = require('./service/keyBoard');

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

var io = require('socket.io')(httpServer);

io.sockets.on('connection', function(socket: any) {
  console.log("Connected");
  connections.push(socket);

  socket.on('join', () => {
    socket.join('room1');
  })

  socket.on('disconnect', function(data: any) {
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected");
  });

  socket.on('send mess', function(data: any) {
    io.sockets.emit('add mess', {mess: data.mess, name: data.name, className: data.className});
    translatorBOT(qwertyArray, data.mess);

  });

});

const PORT: any = process.env.PORT;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

module.exports = {
    httpServer
}

function fetchUserId(socket: any) {
  throw new Error('Function not implemented.');
}
