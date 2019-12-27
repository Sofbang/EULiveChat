let metaData = require('../config/config');
let httpService = require('../../services/httpservice');

function reportOutage() {
    let HttpService = new httpService();


    this.reportStatus = function (session, callback) {
        let content = JSON.parse(session.content)
        console.log(session.content)
        if(content.success){
            session.confirmationNumber = content.data.confirmationNumber
            session.success = true
        } else {
            session.success = false
            if(content.meta.code === "TC-ACCT-INVALID"){
                session.checkString = 'Invalid Account Number'
            } else if(content.meta.code === "TC-USER-INVALID"){
                session.checkString = 'UserInvalid'
            } else {
                session.checkString = 'unknown'
            }
        }
        callback(session)
    };

    this.run = function (session, callback) {
        if(session.loginAuthenticated == 'Yes'){
            metaData.reportOutageAuthenticatedPost.url = metaData.reportOutageAuthenticatedPost.url.replace("?accountNumber",session.account_number);
            HttpService.httpRequest(metaData.reportOutageAuthenticatedPost,metaData.hostName, session, function (session) {
                this.reportStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            console.log("Hello")
            HttpService.httpRequest(metaData.reportOutagePost,metaData.hostName, session, function (session) {
                this.reportStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        }
    }
}

module.exports = reportOutage;