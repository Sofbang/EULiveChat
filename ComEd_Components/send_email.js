"use strict";

var log4js = require('log4js');
var logger = log4js.getLogger();
var request = require('request');
var express = require('express');
var app = express();

var checkMemberEmail;
module.exports = {

    metadata: function metadata() {
        return {
            "name": "SendEmail",
            "properties": {
                "memberEmail": { "type": "string", "required": true },

            },
            "supportedActions": ["valid", "invalid"]
        };
    },

    invoke: (conversation, done) => {
        var flag = false;
        var checkMemberEmail = conversation.properties().memberEmail;
        var userData = require('../memberData.json');
    

        console.log(userData);
        if (userData.lenght != 0) {
            console.log("inside if" + checkMemberEmail);
            for (var i = 0; i < userData.length; i++) {
                console.log("-----------"+userData[i].email +"inside for" + checkMemberEmail);
                if (userData[i].email == checkMemberEmail) {
                    console.log("inside checking" + userData[i].full_name + "Mobile number "+ userData[i].phone_number);
                    var mobileNumber = userData[i].phone_number;
                    
                    //////////////////////////////////////////////////// Generate rand number ///////////////////////////////////////////
                    var rn = require('random-number');
                    var options = {
                        min:  100000,
                        max: 999999,
                        integer: true
                    }
                    var rn_number = rn(options) // example output → 1001


                    ///////////////////////////////////////////////////// Email - Send ///////////////////////////////////////////////////
                    var nodemailer = require('nodemailer');
                    var url = require('url');
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: 'test@gmail.com',
                          pass: 'testpassword@123'
                        }
                      });          
                    var email = userData[i].email ;
                    var message = "<BR>Hello<br>";
                    var mailOptions = {
                        from: 'test@gmail.com',
                        to: email,
                        subject: 'Any Subject',
                        html : message,
                        attachments: [      ]
                    };
                    var error_op ="";
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            error_op = error;
                        console.log(error);
                        } else {
                            error_op = info.response;
                        console.log('Email sent: ' + info.response);
                        }
                    });
  
                    conversation.transition("valid");
                   
                    break;
                } else {
                    console.log("inside else loop");
                    conversation.transition("invalid");
                }
            }
        } else {
            console.log("outside if");
            return new Error(err);
        }
        done();
    }
}


