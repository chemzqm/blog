var mongoose = require('mongoose');
var config = require('config');

//create connection
mongoose.connect(config.get('db uri'));
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


exports.Post = require('./post');


