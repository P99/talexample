
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// Connection URL
var url = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://ca693a8ccfa2cd3464d532afdfab31c5:bf7863d7a446ecb58603a177c5eeed3b@ds011314.mlab.com:11314/accedo';

module.exports = function (app) {
    MongoClient.connect(url, function(err, db) {
        if (!err) {
            console.log("Connected succesfully to server");
            app.use( bodyParser.json() ); // for JSON-encoded bodies
            app.use( cookieParser() );
            registerHistoryHandler(app, db);
        }
    });
}

function registerHistoryHandler(app, db) {
    app.all('/api/history/*', function (req, res) {

        // Utility
        function resolve(err, result) {
            res.send({"status": (err ? "failure" : "success")});
        }

        function findUser(req) {
            var namespace = {};
            if (req && req.cookies && req.cookies.accedo) {
                namespace = JSON.parse(req.cookies.accedo);
            }
            return namespace.userId;
        }
        
        var history, keyword, user;
        history = db.collection('history');
        keyword = req.path.slice(13); // trim '/api/history/'
        user = findUser(req);


        if ((keyword == "new") && (req.method == "PUT")) {
            // Create
            history.updateOne({"id": req.body.id, "user": user}, {$set: req.body}, {upsert: true}, resolve);
        } else if ((keyword == "all") && (req.method == "GET")) {
            // Read
            history.find({"user": user}, {_id: 0, user: 0}).toArray(function(err, docs) {
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
            history.updateOne({"id": keyword, "user": user}, {$set: req.body}, resolve);
        } else if (keyword && (req.method == "DELETE")) {
            // Delete
            history.deleteOne({"id": keyword, "user": user}, resolve);
        } else {
            res.send({"status": "failure"});
        }
    });
}