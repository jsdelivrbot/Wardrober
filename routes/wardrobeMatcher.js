/**
 * Created by Student on 5/19/17.
 */

var mongo = require("./mongo");
var mongodb = require('mongodb');

var mongoURL = "mongodb://vaishnavi:marias@ds147551.mlab.com:47551/wardrober";
var dbHelper = require('./mongo-db-helper');

/**
 *
 * @param given_label
 * @returns {*}
 */
var get_matching_label = function(given_label) {
    switch(given_label) {
        case "t shirt":
            return "shorts";
        case "shorts":
            return "t shirt";
        case "clothing":
            return "clothing";
        default:
            return null;
    }
};

var create_search_query = function(image_name, label_list) {
    /**
     *
     * {
            "image": "5f972961-812f-49b2-aa65-d7fffe68c769.png",
            "$and": [{
                "labels": {
                    "$in": ["t shirt"]
                }
            }, {
                "labels": {
                    "$in": ["pink"]
                }
            }]
        }
     *
     */
    var searchData = {};
    searchData.image = image_name;
    searchData["$and"] = [];
    label_list.forEach(function (label_entry) {
        var result = get_matching_label(label_entry);
        if(result != null) {
            var label_json = {};
            label_json["$in"] = [];
            label_json["$in"].push(result);
            var label_object = {};
            label_object["labels"] = label_json;
            searchData["$and"].push(label_object);
        }
    });
    return searchData;
};

exports.getMatchingImageURLs = function(request, response) {
    mongo.connect(mongoURL, function() {
        var images = mongo.collection('Images');
        var image_details = mongo.collection('Image_details');
        var image_name = request.params.imageName;
        dbHelper.readOne(images, {"puid": request.session.user._id}, null, function (data) {
            //console.log(JSON.stringify(data));
            var image_list = data[request.session.user._id].images;
            var urls = [];
            var len = image_list.length;
            var count = 0;
            dbHelper.readOne(image_details, {"image": image_name}, null, function (image_details_data) {
                image_list.forEach(function(image_entry) {
                    var search_data = create_search_query(image_entry, image_details_data.labels);
                    count = count + 1;
                    console.log(JSON.stringify(search_data));
                    dbHelper.readOne(image_details, search_data, null, function (matched_data) {
                        console.log(matched_data);
                        if(matched_data) {
                            var url = "api/users/images/" + matched_data.image;
                            urls.push(url);
                        }
                        console.log(urls);
                    });
                });
                setTimeout(function() {
                    response.send({
                        "status": 200,
                        "urls": urls
                    });
                }, 5000);
            });
        });
    });
};

exports.getImageLabels = function(request, response) {
    mongo.connect(mongoURL, function() {
        var image_name = request.params.imageName;
        var image_details = mongo.collection('Image_details');
        dbHelper.readOne(image_details, {"image": image_name}, null, function (image_details_data) {
            response.send({
                "status": 200,
                "labels" : image_details_data.labels
            });
        });
    });
};