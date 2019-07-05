const express = require("express");
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookieSession = require('cookie-session')

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(cookieSession({
  secret: 'cualquier cosa',
  maxAge:  3* 60 * 1000,
}));

app.locals.users = [];
app.locals.messages = [];
let users = app.locals.users;
let messages = app.locals.messages;
app.get("/", (req, res) => {
  res.render("login");
});
app.post("/", (req, res) => {
  req.session.userName = req.body.userName;
  users.push(req.body.userName);
  let user = req.body.userName;  
  res.render("index", {user, users});
});

//Web sockets
io.on('connection', socket => {  
  io.emit('userOnline');
  socket.on('disconnect', () => {
    io.emit('userOffline');
  });
  socket.on('chat message', msg => {
    io.emit('chat message', msg, messages);
    messages.push(msg);
  });
});

http.listen(3000, () => console.log('Listening on port 3000!'));