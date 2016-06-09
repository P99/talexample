
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

// Connection URL
var url = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://ca693a8ccfa2cd3464d532afdfab31c5:bf7863d7a446ecb58603a177c5eeed3b@ds011314.mlab.com:11314/accedo';

module.exports = function (app) {
    MongoClient.connect(url, function(err, db) {
        if (!err) {
            console.log("Connected succesfully to server");
            app.use( bodyParser.json() ); // for JSON-encoded bodies
            registerHistoryHandler(app, db);
        }
    });
}

function registerHistoryHandler(app, db) {
    app.all('/api/history/*', function (req, res) {

        function resolve(err, result) {
            res.send({"status": (err ? "failure" : "success")});
        }
        
        var history = db.collection('history');
        var keyword = req.path.slice(13); // trim '/api/history/'

        if ((keyword == "new") && (req.method == "PUT")) {
            // Create
            history.updateOne({"id": req.body.id}, {$set: req.body}, {upsert: true}, resolve);
        } else if ((keyword == "all") && (req.method == "GET")) {
            // Read
            history.find({}).toArray(function(err, docs) {
                if (!err) {
                    res.send({"status": "success",
                        "totalCount": docs.length,
                        "entries": docs
                    });
                } else {
                    res.send({"status": "failure"});
                }
            });
        } else if (keyword && (req.method == "POST")) {
            // Update
            history.updateOne({"id": keyword}, {$set: req.body}, resolve);
        } else if (keyword && (req.method == "DELETE")) {
            // Delete
            history.deleteOne({"id": keyword}, resolve);
        } else {
            res.send({"status": "failure"});
        }
    });
}