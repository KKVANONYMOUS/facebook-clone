const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require('mongoose'),
  user = require('./models/user'),
  passport = require('passport'),
  localStrategy = require('passport-local'),
  postsRoutes = require('./routes/posts'),
  commentsRoutes = require('./routes/comments'),
  profileRoutes = require('./routes/profile'),
  likeRoutes = require('./routes/like'),
  friendsRoutes = require('./routes/friends'),
  authRoutes = require('./routes/auth'),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  http = require("http").createServer(app)

const PORT = process.env.PORT || 3000;

//App Config
mongoose.connect('mongodb://localhost/facebook_clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(bodyParser.urlencoded({
  extended: true
}))
app.set("view engine", "ejs")
app.use(require("express-session")({
  secret: "kkvanonymous",
  resave: false,
  saveUninitialized: false
}))
app.use(express.static('public'))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
})
app.use(methodOverride("_method"))
app.use("/posts", postsRoutes)
app.use("/posts/:id/comments", commentsRoutes)
app.use(authRoutes)
app.use("/profile/:id", profileRoutes)
app.use(likeRoutes)
app.use(friendsRoutes)

//Socket.io Config
let io = require("socket.io")(http).of('/chats'),
  users = {}
io.on("connection", socket => {
  socket.on("new-user-joined", name => {
    users[socket.id] = name;
    socket.emit("info-message", "Welcome to FakeBook Chat")
    socket.broadcast.emit("user-joined", name)
    io.emit("updateOnlineUsers",Object.values(users))
  })

  socket.on("send-message", data => {
    socket.broadcast.emit("receive-message", {
            msg: data.msg,
            name: users[socket.id]
        })
  })

  socket.on("disconnect",()=>{
    socket.broadcast.emit("user-left",`${users[socket.id]} has left the chat`)
    delete users[socket.id]
    io.emit("updateOnlineUsers",Object.values(users))
  })

})

http.listen(PORT, () => {
  console.log("Starting app at PORT:", PORT)
})