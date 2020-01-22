const nodemailer = require('nodemailer');
let mailConfig = null;
let metaData = require('../comed/config/config')

module.exports.mailConfig = function() {
        mailConfig = nodemailer.createTransport({
            host: 'smtp.office365.com', // Office 365 server
            port: 587,     // secure SMTP
            secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
            auth: {
                user: metaData.smtpDetails.username,
                pass: metaData.smtpDetails.password
            },
            requireTLS: true,
            tls: {
                ciphers: 'SSLv3'
            }
        });          

    return mailConfig;
};
