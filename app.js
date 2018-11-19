'use strict';

const express = require('express');
const app = express();

require('./config')(app);
require('./routes')(app);

const port = process.env.PORT || 4343;

app.listen(port, function () {
  console.log('server started on ' + port);
});
