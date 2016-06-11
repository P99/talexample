var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// Connection URL
var url = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://ca693a8ccfa2cd3464d532afdfab31c5:bf7863d7a446ecb58603a177c5eeed3b@ds011314.mlab.com:11314/accedo';

module.exports = function(app) {
    MongoClient.connect(url, function(err, db) {
        if (!err) {
            console.log("Connected succesfully to server");
            app.use(bodyParser.json()); // for JSON-encoded bodies
            app.use(cookieParser());
            registerHistoryHandler(app, db);
        }
    });
}

function registerHistoryHandler(app, db) {
    app.all('/api/history/*', function(req, res) {

        // Utility
        function resolve(err, result) {
            var response;
            if (err || !result || (result === {})) {
                response = {
                    "status": "failure"
                };
            } else {
                response = {
                    "status": "success"
                };
                if (result.length) {
                    response["totalCount"] = result.length;
                    response["entries"] = result;

                } else {
                    response["entry"] = result;
                }
            }
            res.send(response);
        }

        function findUser(req) {
            var namespace = {};
            if (req && req.cookies && req.cookies.accedo) {
                namespace = JSON.parse(req.cookies.accedo);
            }
            return namespace.userId;
        }

        var history, keyword, query, projection;
        history = db.collection('history');
        keyword = req.path.slice(13); // trim '/api/history/'
        query = {
            "id": keyword,
            "user": findUser(req)
        };
        projection = {
            "_id": 0,
            "user": 0
        }

        if (keyword) {
            switch (req.method) {
                case "PUT":
                    // Create
                    if (keyword == "new") {
                        query.id = req.body.id;
                    }
                    // Fall through
                case "POST":
                    // Update
                    history.updateOne(query, {
                        $set: req.body
                    }, {
                        upsert: true
                    }, resolve);
                    break;
                case "GET":
                    // Read
                    if (keyword == "all") {
                        delete query.id;
                        history.find(query, projection).sort({
                            "date": -1
                        }).toArray(resolve);
                    } else {
                        history.findOne(query, projection, resolve);
                    }
                    break;
                case "DELETE":
                    history.deleteOne(query, resolve);
                    break;
            }
        } else {
            resolve("Failure");
        }
    });
}
