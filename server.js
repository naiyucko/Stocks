'use strict';

/*
var express = require('express');
var routes = require('./app/routes/index.js');
var mongo = require('mongodb').MongoClient;
var cookieParser = require('cookie-parser');

var app = express();
app.use(cookieParser());
var http = require( "http" ).createServer( app );
var io = require( "socket.io" )( http );

mongo.connect('mongodb://localhost:27017/clementinejs', function (err, db) {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('MongoDB successfully connected on port 27017.');
    }

    app.use('/public', express.static(process.cwd() + '/public'));
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));

    routes(app, db);
    
    app.listen(8080, function () {
        console.log('Listening on port 8080...');
    });
    
    app.get('/', function(req, res){
      res.sendfile(process.cwd() + '/public/index.html');
    });
    http.listen(8080, "127.0.0.1");
    io.on('connection', function(socket){
      console.log('a user connected');
    });
});
*/
var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

mongo.connect('mongodb://localhost:27017/clementinejs', function (err, db) {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('MongoDB successfully connected on port 27017.');
    }

    server.listen(8080);
    var stocks = db.collection('stocks');
    app.use('/public', express.static(process.cwd() + '/public'));
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.get('/', function (req, res) {
      res.sendFile(process.cwd() + '/public/index.html');
    });
    console.log(process.cwd());
    io.on('connection', function (socket) {
        //Send first data
        stocks.find({}, { '_id': false }, function (err, result) {
         if (err) {
            throw err;
         }

         if (result) {
         	result.toArray(function (err, result) {
         		if (err) {
            		throw err;
         		}
         		io.sockets.emit('news', result);
         	})
            
         } else {
            
         }
      });
      //On user login
      socket.on('my other event', function (data) {
        console.log("A user logged on");
      });
      //Add a stock
      socket.on('addstock', function(data) {
          var tempob = data;
       stocks.insert(tempob, function (err) {
               if (err) {
                  throw err;
               }
               stocks.find({}, { '_id': false }, function (err, result) {
             if (err) {
                throw err;
             }
    
             if (result) {
             	result.toArray(function (err, result) {
             		if (err) {
                		throw err;
             		}
             		io.sockets.emit('news', result);
             	})
                
             } else {
                
             }
          });
            }); 
      });
      //Remove a stock
      socket.on('removestock', function(data) {
          var tempob = data;
          stocks.remove(tempob, function (err, result) {
			if (err) {
            throw err;
         }
         stocks.find({}, { '_id': false }, function (err, result) {
             if (err) {
                throw err;
             }
    
             if (result) {
             	result.toArray(function (err, result) {
             		if (err) {
                		throw err;
             		}
             		io.sockets.emit('news', result);
             	})
                
             } else {
                
             }
          });
		});
      });
    });
});