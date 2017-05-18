/**
 * Created by Vaishampayan Reddy on 4/29/2017.
 */
var MongoClient = require('mongodb').MongoClient;
var test = require('assert');
var db2;
var connected = false;

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(url, callback) {
    MongoClient.connect(url, function(err, _db2) {
        if (err) {
            throw new Error('Could not connect: ' + err);
        }
        db2 = _db2;
        connected = true;
        console.log(connected + " is connected?");
        callback(db2);
    });
};


/**
 * Returns the collection on the selected database
 */
exports.collection = function(name) {
    if (!connected) {
        throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db2.collection(name);
};