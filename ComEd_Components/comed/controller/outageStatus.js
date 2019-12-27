let metaData = require('../config/config');
let httpService = require('../../services/httpservice');

function outageStatus() {
    let HttpService = new httpService();


    this.omsStatus = function (session, callback) {
        let content = JSON.parse(session.content)
        let data = content.data != undefined && content.data.length > 0 ? content.data[0] : content;
        if(content.success){
            session.phone = data.contactHomeNumber;
            if (data.status === "NOT ACTIVE") {
                data.outageReported = null;
                if (data.outageReported !== undefined && data.outageReported !== null && data.outageReported !== "") {
                    session.val = data.outageReported;
                    session.checkString = 'Yes'
                } else {
                    session.val = 'Power is out at ' + data.address;
                    session.checkString = 'No'
                }
            }
        } else {
            session.val = "Number incorrect please try again.";
        }
        callback(session)
    };

    this.run = function (session, callback) {
        if(session.loginAuthenticated == 'Yes'){
            metaData.outageAuthenticatedGet.url = metaData.outageAuthenticatedGet.url.replace("?accountNumber",session.account_number);
            HttpService.httpRequest(metaData.outageAuthenticatedGet,metaData.hostName, session, function (session) {
                this.omsStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            session.phone == "" ? delete metaData.outagePost.postParams.phone : delete metaData.outagePost.postParams.account_number;
            HttpService.httpRequest(metaData.outagePost,metaData.hostName, session, function (session) {
                this.omsStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        }    
    }
}

module.exports = outageStatus;