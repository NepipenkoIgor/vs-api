'use strict'
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport();
const multipart = require('connect-multiparty');

module.exports = function (app) {
  const adminEmail = app.get('config').adminEmail;
  const multipartMiddleware = multipart();

  app.post('/api/v1/send/contact', multipartMiddleware, validatorMiddleware, contacts);

  app.post('/api/v1/send/vacancy', multipartMiddleware, validatorMiddleware, vacancy);

  app.post('/api/v1/send/client', multipartMiddleware, validatorMiddleware, client);

  function validatorMiddleware(req, res, next) {
    const fields = {
      name: {
        type: 'text',
        required: true,
        maxLength: 100
      },
      message: {
        type: 'text',
        required: false,
        maxLength: 10000
      },
      city: {
        type: 'text',
        required: false,
        maxLength: 100
      },
      phone: {
        type: 'regexp',
        required: true,
        regexp: /^\d{10}$/
      },
      email: {
        type: 'regexp',
        required: true,
        regexp: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
      },
      attachment: {
        type: 'attachment',
        allowedDoctypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/pdf']
      }    
    };

    let errors = [];

    Object.keys(req.body).forEach(function (key) {
      const currentValue = req.body[key];
      const currentRule = fields[key];

      switch (currentRule.type) {
        case 'text' :
          if (currentRule.required && !currentValue) {
            errors.push(`${key} field is required`);
          } else if (currentValue.length > currentRule.maxLength) {
            errors.push(`${key} field should contain less than ${currentRule.maxLength} symbols`);
          }
        break;
        case 'regexp' :
          if (currentRule.required && !currentValue) {
            errors.push(`${key} field is required`);
          } else if (!currentValue.match(currentRule.regexp)) {
            errors.push(`${key} field should be specified in valid form`);
          }
        break;
      }
  
    });

    if (req.files && req.files.attachment) {
      if (!fields.attachment.allowedDoctypes.includes(req.files.attachment.type)) {
        errors.push(`Type of attachment is restricted`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).send(errors.join(', '));
    }
    next();
    
  }

  function contacts(req, res) {
    let mailData = {
      from: req.body.email,
      to: adminEmail,
      subject: 'Contact form from site',
      html: `<p><b>Name:</b> ${req.body.name}</p><b>Email:</b>  ${req.body.email}<br /><br /> ${req.body.message}`,
    }

    if (req.files && req.files.attachment) {
      mailData.attachments = [{
        filename: req.files.attachment.originalFilename,
        path: req.files.attachment.path
      }]
    }

    transporter.sendMail(mailData, (err, info) => _sendResult(err, info, res));
  }

  function vacancy (req, res) {
    const cityString = (req.body.city) ? `<b>City:</b>  ${req.body.city}<br />` : '';

    let mailData = {
      from: req.body.email,
      to: adminEmail,
      subject: 'Vacancy form from site',
      html: `<p><b>Name:</b> ${req.body.name}</p><b>Email:</b>  ${req.body.email}<br /><b>Phone:</b>  ${req.body.phone}<br />${cityString}<br /> ${req.body.message}`,
    }

    if (req.files && req.files.attachment) {
      mailData.attachments = [{
        filename: req.files.attachment.originalFilename,
        path: req.files.attachment.path
      }]
    }

    transporter.sendMail(mailData, (err, info) => _sendResult(err, info, res));
  }

  function client(req, res) {
    let mailData = {
      from: req.body.email,
      to: adminEmail,
      subject: 'Clients form from site',
      html: `<p><b>Name:</b> ${req.body.name}</p><b>Email:</b>  ${req.body.email}<br /><br /> ${req.body.message}`,
    }

    if (req.files && req.files.attachment) {
      mailData.attachments = [{
        filename: req.files.attachment.originalFilename,
        path: req.files.attachment.path
      }]
    }

    transporter.sendMail(mailData, (err, info) => _sendResult(err, info, res));
  }

  function _sendResult(err, result, resStream) {
    if (err) {
      console.log(err);
      return resStream.json({success: false, message: 'mail sending error'});
    }
      
    console.log(result);
    resStream.json({success: true});
  }
};
