/*
 * service for simple validate
 */
var express = require ('express');
var app = module.exports = express();
var Canvas = require('canvas');


function vertify_img(req, res) {
    var canvas = new Canvas(45, 22),
        ctx = canvas.getContext('2d'),
        textColors = ['#FD0', '#6c0', '#09F', '#f30', '#aaa', '#3cc', '#cc0', '#A020F0', '#FFA500', '#A52A2A', '#8B6914', '#FFC0CB', '#90EE90'];

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 45, 22);
    ctx.font = 'bold 14px sans-serif';
    ctx.globalAlpha = 0.8;
    var i = 0;
    function setNumber (plus) {
      var rnd = Math.random();
      var number = Math.round(rnd * 10) + (plus || 0);
      var color = Math.round(rnd * (textColors.length - 1));
      ctx.fillStyle = textColors[color];
      ctx.fillText(number, 3 + i*8, 18);
      if( number >= 10 ){
        i = i + 1;
      }
      i = i + 1;
      return number;
    }
    var x = setNumber(10);
    var operate = Math.random() > 0.5 ? '+' : '-';
    ctx.fillStyle = '#FF0000';
    ctx.fillText(operate, 3 + i*8, 18);
    i = i + 1;
    var plus = x > 10 ? 0 : 10;
    var y = setNumber();
    var result = operate === '+' ? x + y : x - y;
    ctx.fillStyle = '#FF0000';
    ctx.fillText('=', 3 + i*8, 18);

    req.session.verifycode = result.toString();

    canvas.toBuffer(function(err, buf){
        res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': buf.length });
        res.end(buf);
    });
}

app.get('/vertifyimg', vertify_img);
