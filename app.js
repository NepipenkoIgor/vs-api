'use strict';
var express = require('express');
var app = express();
require('./config')(app);
require('./routes')(app);
var port = process.env.PORT || 4343
app.listen(port, function () {
    console.log('server start on ' + port + 'port good');
});
