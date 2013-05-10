
/*
 * GET home page.
 */
var express = require ('express');
var path = require('path');
var fs = require ('fs');

var app = module.exports = express();



app.post('/uploadimg',  function(req, res, next) {
    var file = req.files.uploadingFile;
    var name = file.name;
    var targetPath = file.path + path.extname(name);
    fs.rename(file.path, targetPath, function(err) {
        if(err){ return next(err); }
        res.send({
          success: true,
          filepath: targetPath.replace(/^public/, '')
        });
    });
});
