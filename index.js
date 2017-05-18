var express = require('express');
var app = express();

var router = express.Router();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
app.set('port', (process.env.PORT || 5000));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: true, secret: 'historychromeapplication', cookie: { maxAge: 6000000 }}));
router.use('/', express.static('app', { redirect: false }));
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
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


