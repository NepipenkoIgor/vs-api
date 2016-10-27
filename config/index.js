module.exports = function(app) {
	require('./config.js')(app);
  require('./config.express.js')(app);
};
