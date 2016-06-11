# Getting started
```
npm install
node index.js
```
Note: The setup requires Node.js only.
While running locally we use a remote MongoDB database hosted on [MongoLabs](https://mlab.com)

Launch http://localhost:8080

# More information

This project is using [TAL](http://fmtvp.github.com/tal/) framework
It is a fork from [talexemple(https://github.com/fmtvp/talexample)

# History API

Previously played videos are stored on server side, using Node.js / MongoDB
The server is exposing a REST API to handle history items

Operation | Method | URI | Usage
--- | --- | ---
Create | PUT | api/history/new | When user starts playing a video
Read | GET | api/history/all or api/history/<id> | When user select the History menu
Update | POST | api/history/<id> | When returning from playback, elapsed time is amended
Delete | DELETE | api/history/<id> | Not used so far

All history items are stored on a per user basis, using cookies

# Demo

Checkout the [Sample VOD Application demo](http://accedo-p99.rhcloud.com/) on OpenShift

If you want to install the demo on OpenShift, just choose on Node.js + MongoDB cartridge
Then push this repository... You are up dan running ;-)


