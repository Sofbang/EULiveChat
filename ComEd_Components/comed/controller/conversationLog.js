let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
let transporter = require('../../services/nodemailer').mailConfig();
const validator = require("email-validator");
const https = require('https');
let converter = require('json-2-csv');
const moment = require('moment');

function outageStatus() {
    let HttpService = new httpService();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.emailValidation = function(session,callback){
        let validate = validator.validate(session.email);
        session.emailValidation = validate ? true : false;
        callback(session);
    }

    this.getAccessToken = function(oauthApi,session, conversation, callback){
     
        let authorizationToken = "Basic " + Buffer.from(oauthApi.clientId + ':' + oauthApi.clientSecret).toString('base64');
        let postData = "grant_type=client_credentials&scope=" + oauthApi.scopeUrl;
        let indexOfProtocolEnd = oauthApi.idcsHostName.indexOf("://");
        var idcsHostName = oauthApi.idcsHostName.substring(indexOfProtocolEnd + 3);

        var accessToken;

        //define the request method URI and headers
        var options = {
            hostname: idcsHostName,
            port: 443,
            path: oauthApi.idcsAuthorizationURI,
            method: 'POST',
            headers: {
                "content-type": oauthApi.contentType,
                "Authorization": authorizationToken
            }
        }
        conversation.logger().info(options);

        let req = https.request(options, (res) => {
            //not authenicated
            if (res.statusCode == 401) {
                console.log("Client credential authentication failed with http-401");
                session.accessTokenResponse = "unauthorized";
                callback(session);
            }
    
            var responseData = "";
    
            //get chunked response data 
            res.on('data', (data) => {
                responseData = responseData + data;
            })
    
            //finally build authorization token and return from function
            res.on('end', () => {
                accessToken = JSON.parse(responseData).token_type + " " + JSON.parse(responseData).access_token;
                session.accessTokenResponse = accessToken;
                callback(session);
            })
        });
        //return from function if things go bad
        req.on('error', (error) => {
            conversation.logger().info(error);
            session.accessTokenResponse = error;
        });
    
        //send POST request. This actually initiates the request. Only when this code line gets
        //executed, a request will be sent
        req.end(postData);
    }

    this.getConversationLog = function(oauthApi,session, conversation, callback){
        const conversationUri = oauthApi.conversationUri.replace("?sessionId",session.sessionId);
        let indexOfProtocolEnd = oauthApi.odaHostName.indexOf("://");
        var odaHostName = oauthApi.odaHostName.substring(indexOfProtocolEnd + 3);
        
        let options = {
            hostname: odaHostName,
            port: 443,
            path: conversationUri,
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": session.accessTokenResponse
            }
        }
        conversation.logger().info(options)
        
        let req = https.request(options, (res) => {
            //The session doesn't exist or conversation logging on the skill is disabled.
        
            var apiResponse = "";
    
            //get data from response
            res.on('data', (data) => {
                apiResponse = apiResponse + data;
            })
    
            //do something with the data. Note that if the http request is returned with 404, there is no data
            //portion in the returned sessionConversation object
            res.on('end', () => {
                if (res.statusCode == 200) {
                    session.conversationLogResponse = apiResponse ? JSON.parse(apiResponse) : {};
                    callback(session);
                }
                else {
                    session.conversationLogResponse = "No Data Found"
                    callback(session);
                }
            })
        });
    
        req.on('error', (error) => {
            conversation.logger().info(error);
            session.conversationLogResponse = error;
        });
        //its a GET request, so no data to post with the request body
        req.end();
    }
    
    
    this.sendEmail = function(session, conversation, callback){
        Object.keys(session.conversationLogResponse).forEach(function (key) {
            session.conversationLogResponse[key].chatTranscript = session.conversationLogResponse[key].payload;
            session.conversationLogResponse[key].createdOn = moment(new Date(session.conversationLogResponse[key].createdOn)).format('DD/MM/YYYY HH:mm:ss');
            delete session.conversationLogResponse[key].payload;
            delete session.conversationLogResponse[key].id;
        });
        converter.json2csv(session.conversationLogResponse,function(err,csv){
            if(err) {
                conversation.logger().info("CSV Error: " + err);
                
            } else {
                var message = "<br>Hello " + session.email+ "<br><br><br> Please find the attached Chat Transcripts.<br><br>Regards,<br>" + meta.smtpDetails.fromAddress;
                var mailOptions = {
                    from: meta.smtpDetails.fromAddress,
                    to: session.email,
                    subject: 'ComED Chat Transcripts',
                    html : message,
                    attachments: [{
                        filename: 'ChatTranscripts.csv',
                        content: csv
                    }]
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        conversation.logger().info("Email Failed")
                        conversation.logger().info(error);
                        error_op = error;
                        session.emailSent = false;
                        callback(session);
                    } else {
                        error_op = info.response;
                        session.emailSent = true;
                        conversation.logger().info('Email sent: ' + JSON.stringify(info));
                        callback(session);
                    }
                });
            }  
        });
    }

    this.run = function (session, conversation,done, callback) {
        this.emailValidation(session,function(session){
            if(session.emailValidation){
                this.getAccessToken(meta.idcsOauthTokenApi,session, conversation, function(session){
                    this.getConversationLog(meta.idcsOauthTokenApi,session, conversation, function(session){
                        this.sendEmail(session, conversation, function(session){
                            callback(session)
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            } else {
                callback(session)
            }
        }.bind(this));
    }
}

module.exports = outageStatus;