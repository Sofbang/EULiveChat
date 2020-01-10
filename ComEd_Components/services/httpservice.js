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
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIng1dCI6IkRlUXJ2QjM0MFlBU0p6NVhIaWl4TTZTS0pSMCJ9.eyJpc3MiOiJvcmFjbGUubW9iaWxlLmE0NTM1NzYiLCJzdWIiOiJVc2VyXzE4NTk2NTYwNTVAdGVzdC5jb20iLCJvcmFjbGUub2F1dGguY2xpZW50X29yaWdpbl9pZCI6IjA5MjgyZjUwLWVkMTEtNGQ2OC1iNWNiLTIwYmJlZDI2MzM3MyIsIm9yYWNsZS5vYXV0aC50a19jb250ZXh0IjoidXNlcl9hc3NlcnRpb24iLCJhdWQiOlsiaHR0cHM6Ly9leGVsb25ldW1vYmlsZWFwcHRlc3QtYTQ1MzU3Ni5tb2JpbGVlbnYudXMyLm9yYWNsZWNsb3VkLmNvbTo0NDMvbW9iaWxlIiwiaHR0cDovL3VzMnoyMC1tb2JpbGUtbW9iZW52NjkyMy1jb3JlMS5vcGNtb2JpbGUuejIwLnVzZGMyLm9yYWNsZWNsb3VkLmNvbS9pbnRlcm5hbC1ydCJdLCJvbWNzLWNpdCI6ImIiLCJvcmFjbGUtbW9iaWxlLXVzZXItcm9sZXMiOlsiZXhlbG9uZXVtb2JpbGVhcHB0ZXN0X01vYmlsZUVudmlyb25tZW50X29wY286Q09NRUQiLCJleGVsb25ldW1vYmlsZWFwcHRlc3RfTW9iaWxlRW52aXJvbm1lbnRfdXNlcjpVc2VyXzE4NTk2NTYwNTVAdGVzdC5jb20iLCJleGVsb25ldW1vYmlsZWFwcHRlc3RfTW9iaWxlRW52aXJvbm1lbnRfaWQ6ODY1Mjg0MjIyIiwiZXhlbG9uZXVtb2JpbGVhcHB0ZXN0X01vYmlsZUVudmlyb25tZW50X2N1c3RvbWVyIiwiZXhlbG9uZXVtb2JpbGVhcHB0ZXN0X01vYmlsZUVudmlyb25tZW50X3R5cGU6cmVzaWRlbnRpYWwiLCJleGVsb25ldW1vYmlsZWFwcHRlc3RfTW9iaWxlRW52aXJvbm1lbnRfYmdldHN0cmVhbG1fMV8wX1JlYWxtIiwiZXhlbG9uZXVtb2JpbGVhcHB0ZXN0X01vYmlsZUVudmlyb25tZW50X2VtYWlsOlVzZXJfMTg1OTY1NjA1NUB0ZXN0LmNvbSIsImV4ZWxvbmV1bW9iaWxlYXBwdGVzdF9Nb2JpbGVFbnZpcm9ubWVudF9DT01FRF9jdXN0b21lciJdLCJpYXQiOjE1Nzg2NDM0MjAsImV4cCI6MTYxMDE4MzQyMH0.R44XJkyR3FI6I6UitKs8pK_QxC_5sDHuqGv9ejUdo3X4QTW39m8WyajepcDmvAV9pTmwbJLa2XrsGs1Sst31tfryPacZoksm9L0_vvA21-Fcrif1rhv7yYwNyp5_ixJl6bVkyxCqaotaXQLtCB_wPJpDY1rwRF9NSsqyHbY2XkwdZAtbjp_lyrocW_TRXAk-Jo83w_NnJOVbtwDQQY7uPsnJ1urF5BzFrrcURVaFmtYek_ixvjX7yDid3Dw0a4zfEXkd9uTErGl62XH0YnmE-99oO7CLvrF0MjE9bUiexUKWaehqgB4S5jveF98A6pI4VtPlBiHj5WxziNPKxx4uOg',//'Basic YW5vbl90c3Q6NkclUXViQGxaQm1vZ09xJFc4Qlg=',
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