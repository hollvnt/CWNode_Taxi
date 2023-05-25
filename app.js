const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const cookieParser = require('cookie-parser');
const path = require('path');
const https = require('https');
const socketIO = require('socket.io');
const socketIOClient = require('socket.io-client');
const prisma = new PrismaClient();
const session = require('express-session');
const passport = require('passport');
const fs = require('fs');

const registerRouter = require('./routes/registerRoute')(prisma);
const loginRouter = require('./routes/loginRoutes')(prisma);
const orderRouter = require('./routes/orderRoute')(prisma);
const userProfileRouter = require('./routes/profileUserRoute')(prisma);
const driverRegisterRouter = require('./routes/driverRegisterRoute')(prisma);
const driverLoginRouter = require('./routes/driverLoginRoute')(prisma);
const driverPageRouter = require('./routes/droiverPageRoute')(prisma);
const driverProfileRouter = require('./routes/driverProfileRoute')(prisma);

const app = express();
const server = https.createServer(
  {
    // key: fs.readFileSync('localhost.decrypted.key'),
    // cert: fs.readFileSync('localhost.crt')
    key: fs.readFileSync('ELAPI.key').toString(),
	cert: fs.readFileSync('ELAPI.crt').toString()
  },
  app
);
const io = socketIO(server);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', registerRouter);
app.use('/api', loginRouter);
app.use('/api', orderRouter);
app.use('/api', userProfileRouter);
app.use('/api', driverRegisterRouter);
app.use('/api', driverLoginRouter);
app.use('/api', driverPageRouter);
app.use('/api', driverProfileRouter);
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('D:/3 курс 2 сем/кп/views'));

app.use(bodyParser.urlencoded({
  extended: false
}));

const indexPath = path.join(__dirname, 'views', 'index.html');
app.get('/', (req, res) => {
  res.sendFile(indexPath);
});
const orderPath = path.join(__dirname, 'views', 'main.html');
app.get('/api/order', (req, res) => {
  res.sendFile(orderPath);
});

const registerPath = path.join(__dirname, 'views', 'registerIndex.html');
app.get('/api/register', (req, res) => {
  res.sendFile(registerPath);
});

const regDriverPath = path.join(__dirname, 'views', 'registerDriver.html');
app.get('/api/becomeDriver', (req, res) => {
  res.sendFile(regDriverPath);
});
app.get('/api/logout', (req, res) => {
  res.cookie('AuthToken', '', { maxAge: 0 });
  res.redirect('https://localhost');
});

const loginDriverPath = path.join(__dirname, 'views', 'driverIndex.html');
app.get('/api/driverLogin', (req, res) => {
  res.sendFile(loginDriverPath);
});

app.use('/', userProfileRouter);

io.on('connection', (socket) => {
  console.log('A user connected'); 
  socket.on('orderAccepted', (order) => {
  socket.broadcast.emit('orderAccepted', order);
  }); 
  socket.on('orderCompleted', (order) => {
  socket.broadcast.emit('orderCompleted', order);
  });
  

  socket.on('disconnect', () => {
  console.log('A user disconnected');
  });
  });
  
  server.listen(443, () => {
  console.log('Server is running on port 443 (HTTPS)');
  });
