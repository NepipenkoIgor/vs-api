var bodyParser = require('body-parser');
var express = require('express');
module.exports = function (app) {
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(express.static('public'));
  app.use(function(req, res, next) {

  	const origin = req.headers.origin;
  	const acceptedOrigins = process.env.ACCEPTED_ORIGINS.split(',') || app.get('config').allowedOrigins;
  	if (!origin || !acceptedOrigins.includes(origin)) {
  		return res.status(403).send('Forbidden');
  	}

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
};
