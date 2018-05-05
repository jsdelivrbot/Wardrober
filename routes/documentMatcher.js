/**
 * Created by Student on 5/19/17.
 */

var mongo = require("./mongo");
var mongodb = require('mongodb');

var mongoURL = "mongodb://vaishnavi:marias@ds147551.mlab.com:47551/wardrober";
var dbHelper = require('./mongo-db-helper');

exports.getMinedDataFromWeb = function(request, response) {
    mongo.connect(mongoURL, function() {
        var images = mongo.collection('Images');
        var image_details = mongo.collection('Image_details');
        var image_name = request.params.imageName;
        dbHelper.readOne(images, {"puid": request.session.user._id}, null, function (data) {
            var image_list = data[request.session.user._id].images;
            var urls = [];
            var len = image_list.length;
            var count = 0;
            dbHelper.readOne(image_details, {"image": image_name}, null, function (image_details_data) {

                console.log(image_details_data);

                // the text in the image is present in
                console.log(image_details_data.labels);

                // Call the mining service/function with the first value in teh index
                // image_details_data.labels[0]
            });
        });
    });
};

exports.getImageLabels = function(request, response) {
    mongo.connect(mongoURL, function() {
        var image_name = request.params.imageName;
        var image_details = mongo.collection('Image_details');
        dbHelper.readOne(image_details, {"image": image_name}, null, function (image_details_data) {
            console.log("here");
            console.log(image_details_data);
            response.send({
                "status": 200,
                "labels" : image_details_data.text
            });
        });
    });
};