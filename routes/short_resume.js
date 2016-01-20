var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
module.exports = function (app) {
  var adminEmail = app.get('adminEmail');
  app.post('/api/v1/send/contact', function (req, res) {
    var mailObj = req.body;
    transporter.sendMail({
      from: mailObj.email,
      to: adminEmail,
      subject: 'Notification from valor-software site',
      text: "Hello. i'm " + mailObj.name + '. ' + mailObj.message
    }, function (err) {
      res.json({success: !err, msg: [], data: true, error: err});
    });
  });
};