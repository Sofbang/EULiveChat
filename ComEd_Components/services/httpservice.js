"use strict";

var request = require('request');
var cheerio = require('cheerio');

var log_mode = (process.env.LOG_MODE != null) ? process.env.LOG_MODE : 'debug';


function httpservice() {

    var req = request.defaults({
        jar: request.jar(),                // save cookies to jar
        headers: {
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIng1dCI6IkRlUXJ2QjM0MFlBU0p6NVhIaWl4TTZTS0pSMCJ9.eyJpc3MiOiJvcmFjbGUubW9iaWxlLmE0NTM1NzYiLCJzdWIiOiJVc2VyXzE5NjU0MDAwNTJAdGVzdC5jb20iLCJvcmFjbGUub2F1dGguY2xpZW50X29yaWdpbl9pZCI6IjA5MjgyZjUwLWVkMTEtNGQ2OC1iNWNiLTIwYmJlZDI2MzM3MyIsIm9yYWNsZS5vYXV0aC50a19jb250ZXh0IjoidXNlcl9hc3NlcnRpb24iLCJhdWQiOlsiaHR0cHM6Ly9leGVsb25ldW1vYmlsZWFwcHRlc3QtYTQ1MzU3Ni5tb2JpbGVlbnYudXMyLm9yYWNsZWNsb3VkLmNvbTo0NDMvbW9iaWxlIiwiaHR0cDovL3VzMnoyMC1tb2JpbGUtbW9iZW52NjkyMy1jb3JlMS5vcGNtb2JpbGUuejIwLnVzZGMyLm9yYWNsZWNsb3VkLmNvbS9pbnRlcm5hbC1ydCJdLCJvbWNzLWNpdCI6ImIiLCJvcmFjbGUtbW9iaWxlLXVzZXItcm9sZXMiOlsiZXhlbG9uZXVtb2JpbGVhcHB0ZXN0X01vYmlsZUVudmlyb25tZW50X29wY286Q09NRUQiLCJleGVsb25ldW1vYmlsZWFwcHRlc3RfTW9iaWxlRW52aXJvbm1lbnRfZW1haWw6VXNlcl8xOTY1NDAwMDUyQHRlc3QuY29tIiwiZXhlbG9uZXVtb2JpbGVhcHB0ZXN0X01vYmlsZUVudmlyb25tZW50X3VzZXI6VXNlcl8xOTY1NDAwMDUyQHRlc3QuY29tIiwiZXhlbG9uZXVtb2JpbGVhcHB0ZXN0X01vYmlsZUVudmlyb25tZW50X2N1c3RvbWVyIiwiZXhlbG9uZXVtb2JpbGVhcHB0ZXN0X01vYmlsZUVudmlyb25tZW50X3R5cGU6cmVzaWRlbnRpYWwiLCJleGVsb25ldW1vYmlsZWFwcHRlc3RfTW9iaWxlRW52aXJvbm1lbnRfaWQ6NDY1NTA3NDQ4IiwiZXhlbG9uZXVtb2JpbGVhcHB0ZXN0X01vYmlsZUVudmlyb25tZW50X2JnZXRzdHJlYWxtXzFfMF9SZWFsbSIsImV4ZWxvbmV1bW9iaWxlYXBwdGVzdF9Nb2JpbGVFbnZpcm9ubWVudF9DT01FRF9jdXN0b21lciJdLCJpYXQiOjE1NzU5MjUwMjUsImV4cCI6MTYwNzQ2NTAyNX0.Q2ebD_fIrNshy8DZOYLPs7ofJkck8V9BMfs25M0b5AWLpmwU5HFhHtVBpEuCc0IbhWangjjr6DnEsf4tHx4K9EJiq-Rk41iFt51exBMKaR1qn4iunHoXTd50SlSahGHbe5E_LaXK35CgEDbzZHlAKd1D-7IrTV7Ut1zSdXAMdjfyB7k2dNW3dt3rRQG56PiQmJXnP8BsgPEu8jQ_-NNYMStqHtzI5Mv7z7rEGI0cONH365BaReWenwNKSt9j4xYAoD7bDSeuqNZwa8LZyuh2dpcJDpVZUFnmVBYwTvhry_5gUMgVi4EtUKWXalDTBjM4ysfTF1fQH5VYTxWVZddotg',//'Basic YW5vbl90c3Q6NkclUXViQGxaQm1vZ09xJFc4Qlg=',
            'oracle-mobile-backend-id': '09282f50-ed11-4d68-b5cb-20bbed263373'
        },
        followAllRedirects: true
    });

    this.httpRequest = function (stepMetadata,hostName, session, callback) {
        try {
            let form = {};
            let reqOptions = {
                url: stepMetadata.url.replace('?hostName',hostName),
            };

            this.prepareGet(reqOptions, session, stepMetadata);

            if (stepMetadata.method === "Get") {
                console.log(reqOptions)
                req.get(reqOptions, function (err, resp, responseContent) {
                    if (err) {
                        console.error(err);
                    }
                    session.content = responseContent;
                    callback(session);
                }.bind(this))
            } else if (stepMetadata.method === "Put") {
                console.log(reqOptions)
                req.put(reqOptions, function (err, resp, responseContent) {
                    if (err) {
                        console.error(err);
                    }
                    session.content = responseContent;
                    callback(session);
                }.bind(this))
            } else {
                this.preparePost(reqOptions, session, stepMetadata);
                console.log(reqOptions)
                req.post(reqOptions, function (err, resp, responseContent) {
                    if (err) {
                        console.error(err);
                    }
                    session.content = responseContent;
                    callback(session);
                }.bind(this));
            }
        } catch (err) {
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