'use strict';

var express      = require('express');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');

var app = express();

app.use(cookieParser());
app.use(logger('dev'));

app.use('/tests', express.static(__dirname + "/tests"));
app.get('/tests/cookie_included/:cookieName', function(req, res) {
    if (req.cookies && req.cookies[req.params.cookieName]) {
        res.json(1);
    } else {
        res.json(0);
    }
});
app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.redirect(301, '/tests/');
});

var server = app.listen(3000, function () {
  console.log('Mixpanel test app listening on port %s', server.address().port);
});
