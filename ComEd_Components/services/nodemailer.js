const nodemailer = require('nodemailer');
let mailConfig = null;

module.exports.mailConfig = function() {
        mailConfig = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'mannavakarthik009@gmail.com',
              pass: 'kc16050208'
            }
          });          

    return mailConfig;
};
