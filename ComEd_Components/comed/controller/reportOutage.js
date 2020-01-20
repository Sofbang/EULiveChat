let metaData = require('../config/config');
let httpService = require('../../services/httpservice');

function reportOutage() {
    let HttpService = new httpService();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.reportStatus = function (session, callback) {
        if(session.content == 401){
            session.statusCode = 401;
            callback(session)
        } else {
            let content = JSON.parse(session.content)
            if(content.success){
                session.confirmationNumber = content.data.confirmationNumber;
                session.success = true;
                callback(session);
            } else {
                session.success = false
                if(content.meta.code === "TC-ACCT-INVALID"){
                    session.checkString = 'Invalid Account Number';
                    callback(session);
                } else if(content.meta.code === "TC-USER-INVALID"){
                    session.checkString = 'UserInvalid';
                    callback(session);
                } else {
                    session.checkString = 'unknown';
                    callback(session);
                }
            }
        }
    };

    this.run = function (session, callback) {
        if(session.loginAuthenticated == 'Yes'){
            meta.reportOutageAuthenticatedPost.url = meta.reportOutageAuthenticatedPost.url.replace("?accountNumber",session.account_number);
            HttpService.httpRequest(meta.reportOutageAuthenticatedPost,meta.hostName, session, function (session) {
                this.reportStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            HttpService.httpRequest(meta.reportOutagePost,meta.hostName, session, function (session) {
                this.reportStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        }
    }
}

module.exports = reportOutage;