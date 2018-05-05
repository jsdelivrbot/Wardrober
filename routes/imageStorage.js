var mongo = require("./mongo");
var mongodb = require('mongodb');
var fs = require('fs');
var http = require('http');
var util = require('util');

var mongoURL = "mongodb://vaishnavi:marias@ds147551.mlab.com:47551/wardrober";
var dbHelper = require('./mongo-db-helper');
var uuid = require('uuid');
var path = require('path');

var vision = require('@google-cloud/vision')({
    projectId: 'divine-display-203219',

    // The path to your key file:
    keyFilename: 'public/document-finder.json'
});

// Read the text from an image.

var API_KEY  = 'AIzaSyCR-FiwIaiBTeCv9CfWLPng9FXdIni99DQ';
var types = [
    'label'
];
exports.postImagesForUserByPuid = function(request, response, image_name) {
    vision.detectText('public/uploads/' + image_name,  function(err, text, apiResponse) {
        mongo.connect(mongoURL, function() {
            var images = mongo.collection('Images');
            var image_details = mongo.collection('Image_details');
            dbHelper.doesExistInDb(images, {
                "puid": request.session.puid
            }, function() {
                dbHelper.readOne(images, {"puid":request.session.puid}, null, function(data) {
                 //image_details
                    var image_details_post_data  = {};
                    image_details_post_data.image = image_name;
                    image_details_post_data.text = text;

                    dbHelper.insertIntoCollection(image_details, image_details_post_data, function() {
                        var imageID = image_name;
                        var userpuid = request.session.puid;
                        data[userpuid].images.push(imageID);
                        //console.log(data);
                        //already present in db

                        var searchData = {};
                        searchData.puid = request.session.puid;
                        var postData = {};
                        var imageKey = {};
                        imageKey[userpuid] = data[userpuid];
                        postData['$set'] = imageKey;
                        dbHelper.updateCollection(images, searchData, postData, function() {
                            storeInMongoImage(request, response, imageID, text);
                        });
                    });
                });
            },
            function() {
                var puidData = {};
                var postData = {};
                var image_details_post_data  = {};
                image_details_post_data.image = image_name;
                image_details_post_data.text = text;

                dbHelper.insertIntoCollection(image_details, image_details_post_data, function() {
                    var imageID = image_name;
                    puidData.images = [];
                    puidData.images.push(imageID);
                    postData.puid = request.session.puid;
                    postData[request.session.puid] = puidData;
                    dbHelper.insertIntoCollection(images, postData, function() {
                        storeInMongoImage(request, response, imageID, text);
                    });
                });
            });
        });
    });
};

var storeInMongoImage = function(request, response, imageID, text) {
    mongodb.MongoClient.connect(mongoURL, function(error, db) {
        var bucket = new mongodb.GridFSBucket(db, {
            chunkSizeBytes: 1024,
            bucketName: 'images'
        });
        fs.createReadStream(request.file.path).
        pipe(bucket.openUploadStream(imageID)).
        on('error', function(error) {
            if(error) {
                response.send({
                    "status" : 500,
                    "errmsg" : "Error: Cannot upload image: " + error
                });
            }
        }).
        on('finish', function() {
            console.log('done!');
            response.send({
                "status" : 200,
                "message" : "Image uploaded successfully for user with puid: " + 100,
                "labels" : text
            });
        });
    });
};

exports.getImageUrlsForUserByPuid = function(request, response) {
    mongo.connect(mongoURL, function() {
        var images = mongo.collection('Images');
        dbHelper.doesExistInDb(images, {
            "puid" : request.session.puid
        }, function() {
            dbHelper.readOne(images, {"puid": request.session.puid}, null, function(data) {
                //uuid.v4();
                console.log(JSON.stringify(data));
                var imageUrls = [];
                for (var index = 0; index < data[request.session.puid].images.length; index++) {
                    var imageUrl = 'api/users/images/' + data[request.session.puid].images[index];
                    imageUrls.push(imageUrl);
                }
                response.send({
                    "status" : 200,
                    "urls" : imageUrls
                });
            });
        }, function() {
            response.send({
                "status" : 404,
                "errmsg" : "Error: No images found for user in db with puid: " + 100
            });
        });
    });
};

exports.getImageByImageUrl = function(request, response) {
    try {
        var images = mongo.collection('images.files');
        dbHelper.doesExistInDb(images, {
            "filename" : request.params.imageName
        },function() {
            response.setHeader('Content-type', 'image/png');
            mongodb.MongoClient.connect(mongoURL, function(error, db) {
                var bucket = new mongodb.GridFSBucket(db, {
                    chunkSizeBytes: 1024,
                    bucketName: 'images'
                });
                bucket.openDownloadStreamByName(request.params.imageName).
                pipe(response).
                on('error', function(error) {
                }).
                on('finish', function() {
                });
            });
        }, function() {
            var filePath = "public/images/default.jpg";
            var stat = fs.statSync(filePath);

            response.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': stat.size
            });

            var readStream = fs.createReadStream(filePath);
            readStream.pipe(response);
        });
    }
    catch(error) {
        response.send({
            "status" : 404,
            "errmsg" : "Error: Unable to get images: " + error
        });
    }
};
