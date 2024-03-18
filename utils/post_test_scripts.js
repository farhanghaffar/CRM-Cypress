var moment = require('moment');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'firstfreightreporter@gmail.com',
    pass: '%Vh3au"=UnQ9/w24'
  }
});

var mailOptions = {
  from: 'Cypress Report',
  to: 'thomas.dowling321@gmail.com',
  subject: `Cypress Nightly Run Report - ${moment().format('MM/DD/YY')}`,
  text: 'Cypress Nightly run report',
  attachments: [
    {
      filename: 'index.html',
      path: './mochawesome-report/index.html'
    }
  ]
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});