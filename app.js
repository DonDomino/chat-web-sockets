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
app.locals.userName = "";
app.locals.messages = [];
app.get("/", (req, res) => {
  res.render("login");
});
app.post("/", (req, res) => {
  app.locals.userName = req.body.userName;
  req.session.userName = app.locals.userName;
  app.locals.users.push(req.body.userName);
  let user = req.body.userName
  console.log(app.locals.users);
  res.render("index", {user});
});

//Web sockets
io.on('connection', socket => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
    console.log(msg);
    app.locals.messages.push(msg);
  });
});

http.listen(3000, () => console.log('Listening on port 3000!'));