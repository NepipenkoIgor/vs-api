'use strict'
module.exports = function(app) {
	const _config = {
		adminEmail: 'oleg.rybnikov@valor-software.com',
		allowedOrigins: ['http://localhost:4200']
	};
  app.set('config', _config);
};
