var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(session({resave: true, saveUninitialized: true, secret: 'wardroberApplication', cookie: { maxAge: 6000000 }}));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

// serve angular front end files from root path

var logger = require('morgan');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
//router.use('/', express.static('app', { redirect: false }));
app.get('/', function(req, res) {
    //console.log("entered here");
    //console.log(req.session.profile);
    if(req.session.profile) {
        res.sendfile(__dirname + '/public/home.html');
    }
    else {
        res.sendfile(__dirname + '/public/index.html');
    }
});
//app.use(express.static(__dirname + '/public'));

// views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

var authentication = require('./routes/authentication');


app.post('/api/login', authentication.doLogin);
app.post('/api/signup', authentication.doSignUp);
app.get('/api/logout', authentication.doLogout);
app.get('/api/isLoggedIn', function(request, response) {
   if(request.session && request.session.user) {
       response.send({
           "status": 200,
           "message": "User logged In"
       });
   }
   else {
       response.send({
           "status": 401,
           "errmsg": "User unauthorized"
       });
   }
});

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


