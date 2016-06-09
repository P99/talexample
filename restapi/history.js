
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

// Connection URL
var url = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://ca693a8ccfa2cd3464d532afdfab31c5:bf7863d7a446ecb58603a177c5eeed3b@ds011314.mlab.com:11314/accedo';

module.exports = function (app) {
    // Use connect method to connect to the server
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
        console.log("Received REST request: " + req.path + " method: " + req.method);
        res.send('hello world');
        
        var keyword = req.path.slice(13); // trim '/api/history/'
        console.log("url: " + keyword);

        if ((keyword == "new") && (req.method == "POST")) {
            // Insert new history item into database
            var history = db.collection('history');
            console.log("JSON: " + JSON.stringify(req.body));
            //history.insert(req.body);
        }
    });
}