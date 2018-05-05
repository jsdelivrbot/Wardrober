/**
 * Created by Student on 5/18/17.
 */

var mongoDbHelper = require('./mongo-db-helper');
var mongo = require("./mongo");
var mongoURL = "mongodb://vaishnavi:marias@ds147551.mlab.com:47551/wardrober";

/**
 * performs user login
 * @param request
 * @param response
 */
exports.doLogin = function(request, response) {
    var email = request.body.email;
    var password = request.body.password;
    mongo.connect(mongoURL, function() {
        var usersCollection = mongo.collection('Users');
        mongoDbHelper.readOne(usersCollection,{'email':email},null, function(data) {
            console.log(data);
            if(data == undefined){
                response.send({
                    "status": 401,
                    "errmsg": "Account doesn't exists"});
            }else{
                var getPassword = data.password;
                if(password===getPassword){
                    request.session.user = data;
                    request.session.puid = data.puid;
                    request.session.user.password = "";
                    response.send({
                        "Status":200,
                        "Message":"Validation Successfull"
                    });
                }else{
                    response.send({
                        "Status":401,
                        "Message":"Unauthorized"
                    });
                }
            }
        });
    });
};

/**
 * performs user signup
 * @param request
 * @param response
 */
exports.doSignUp = function(request, response) {
    var user = {};
    user.firstname = request.body.firstname;
    user.lastname = request.body.lastname;
    user.email = request.body.email;
    user.password = request.body.password;
    user.puid = Math.floor(Math.random() * 1000000);
    mongo.connect(mongoURL, function() {
        var usersCollection = mongo.collection('Users');
        mongoDbHelper.readOne(usersCollection,{'email':user.email},null,function(data){
            //console.log(data);
            if(data == undefined){
                console.log("registering in db");
                mongoDbHelper.insertIntoCollection(usersCollection, user, function() {
                    response.send({
                        "status":200,
                        "message":"Registration Successfull"}
                        );
                });
            }//if condition end
            else
            {
                response.send(
                    {
                        "status" : 409,
                        "errmsg" : "User already registered with this email, Try another email!"
                    }
                );
            }
        });
    });
};

/**
 * logouts a user
 * @param request
 * @param response
 */
exports.doLogout = function(request,response){
    request.session.destroy();
    response.send({
        "status":200,
        "message":"User Logged out"
    });
};