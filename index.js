/**
 * Created by Student on 5/19/17.
 */
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.methodOverride());
app.use(session({resave: true, saveUninitialized: true, secret: 'documentFinder', cookie: { maxAge: 6000000 }}));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

// serve angular front end files from root path

var logger = require('morgan');
app.use(logger('dev'));

var authentication = require('./routes/authentication');
var imageStorage = require('./routes/imageStorage');
var wardrobeMatcher = require('./routes/documentMatcher');

app.post('/api/login', authentication.doLogin);
app.post('/api/signup', authentication.doSignUp);
app.get('/api/logout', authentication.doLogout);
app.get('/api/isLoggedIn', function(request, response) {
    if(request.session && request.session.user) {
        response.send({
            "status": 200,
            "message": "User logged In",
            "user": request.session.user
        });
    }
    else {
        response.send({
            "status": 401,
            "errmsg": "User unauthorized"
        });
    }
});

/**
 * core API
 */
var mongoURL = "mongodb://vaishnavi:marias@ds147551.mlab.com:47551/wardrober";

var multer = require('multer');
var uuid = require('uuid');
var image_name = uuid.v4() + ".png";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        image_name = uuid.v4() + ".png";
        cb(null, image_name)
    }
});

//var upload = multer({dest: 'public/uploads/'});
var upload = multer({ storage: storage })

app.post('/api/users/images', upload.single('image'), function(request, response) {
    imageStorage.postImagesForUserByPuid(request, response, image_name);
});
app.get('/api/users/images', imageStorage.getImageUrlsForUserByPuid);
app.get('/api/users/images/:imageName', imageStorage.getImageByImageUrl);
app.get('/api/users/images/:imageName/labels', wardrobeMatcher.getImageLabels);
app.get('/api/users/images/:imageName/results/mine', wardrobeMatcher.getMinedDataFromWeb);

app.get('/', function(request, response) {
    response.render('pages/index');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
