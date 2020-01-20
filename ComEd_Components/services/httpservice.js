"use strict";

var request = require('request');
var cheerio = require('cheerio');

var log_mode = (process.env.LOG_MODE != null) ? process.env.LOG_MODE : 'debug';


function httpservice() {
    var req = request.defaults({
        jar: request.jar(),                // save cookies to jar
        followAllRedirects: true
    });
    this.httpRequest = function (stepMetadata,hostName, session, callback) {

        try {
            let form = {};
            let reqOptions = {
                url: stepMetadata.url.replace('?hostName',hostName),
                headers: {
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/json',
                    'oracle-mobile-backend-id': '09282f50-ed11-4d68-b5cb-20bbed263373',
                    'Authorization': session.loginAuthenticated != undefined && session.loginAuthenticated == "No" ? "Basic YW5vbl90c3Q6NkclUXViQGxaQm1vZ09xJFc4Qlg=" : 'Bearer ' + session.token,
                    'Cookie': 'ASP.NET_SessionId='+ session.sessionId
                },
            };

            session.loginAuthenticated != undefined && session.loginAuthenticated == "No" ? delete reqOptions.headers.Cookie : reqOptions;

            this.prepareGet(reqOptions, session, stepMetadata);

            if (stepMetadata.method === "Get") {
                console.log(reqOptions)
                req.get(reqOptions, function (err, resp, responseContent) {
                    if (err) {
                        console.error(err);
                    }
                    if(resp.statusCode == 401){
                        session.content = 401;
                        callback(session);
                    } else {
                        session.content = responseContent;
                        callback(session);
                    }
                }.bind(this))
            } else if (stepMetadata.method === "Put") {
                req.put(reqOptions, function (err, resp, responseContent) {
                    if (err) {
                        console.error(err);
                    }
                    if(resp.statusCode == 401){
                        session.content = 401;
                        callback(session);
                    } else {
                        session.content = responseContent;
                        callback(session);
                    }
                }.bind(this))
            } else {
                this.preparePost(reqOptions, session, stepMetadata);
                console.log(reqOptions)    
                req.post(reqOptions, function (err, resp, responseContent) {
                    if (err) {
                        console.error(err);
                    }
                    if(resp.statusCode == 401){
                        session.content = 401;
                        callback(session);
                    } else {
                        session.content = responseContent;
                        callback(session);
                    }
                }.bind(this));
            }
        } catch (err) {
            console.log(err)
            //logger.runTimeException(session, err);
        }
    }.bind(this);

    this.prepareGet = function (reqOptions, session, stepMetadata) {
        var getParams = stepMetadata.getParams;
        for (var key in getParams) {
            getParams[key] = session[key];
            reqOptions.url += key + '=' + getParams[key] + '&';

        }
    };

    this.preparePost = function (reqOptions, session, stepMetadata) {
        if (stepMetadata.hasOwnProperty("postParams")) {
            var requestParams = JSON.parse(JSON.stringify(stepMetadata.postParams));
            for (var key in requestParams) {
                requestParams[key] = requestParams[key].indexOf('?') !== -1 ? session[requestParams[key].replace('?', '')] : requestParams[key];
            }
            reqOptions.form = requestParams;
        }
    };
}

module.exports = httpservice;