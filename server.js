const express = require ('express') // server software
const bodyParser = require('body-parser') // parser middleware
const session = require('express-session') // session middleware
const passport = require('passport') // authentication
const connectEnsureLogin = require('connect-ensure-login') // authorization
const User = require('./user.js')
const hbs = require('hbs')
const path = require('path')
const app = express()
const partialsPath = path.join(__dirname, '/client/template/partials')
hbs.registerPartials(partialsPath)

const viewsPath = path.join(__dirname, '/client/template/views')
app.set('views', viewsPath)

app.set('view engine', 'hbs')



app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 * 60 * 1000}
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/register', (req, res) => {
  res.render('register');
})

  
// Route to Dashboard
app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  // res.send(`Hello ${req.user.username}. Your session ID is ${req.sessionID} 
  // and your session expires in ${req.session.cookie.maxAge} 
  // milliseconds.<br><br>
  // <a href="/logout">Log Out</a><br><br><a href="/secret">Members Only</a>`);
  res.render('dashboard', {
    name: req.user.username
  })
});

// Route to Secret Page
app.get('/secret', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile(__dirname + '/static/secret-page.html');
});

// Route to Log out
app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Post Route: /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),  function(req, res) {
    console.log(req.user)
    res.redirect('/dashboard');
});

app.post('/register', function(req, res) {
  User.register({ username: req.body.username, active: false }, req.body.password);
  res.redirect('/login');
});

// assign port
const port = 4000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));
