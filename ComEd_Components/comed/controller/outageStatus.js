let metaData = require('../config/config');
let httpService = require('../../services/httpservice');

function outageStatus() {
    let HttpService = new httpService();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.omsStatus = function (session, callback) {
        let content = JSON.parse(session.content)
        let data = content.meta != undefined && content.meta.code == "FN-ACCT-MULTIPLE" ? content.data : content.data != undefined && content.data.length > 0 ? content.data[0] : content;
        console.log(data)
        if(content.success){
            session.phone = data.contactHomeNumber;
            if(data.length > 1){
                session.multipleAcc = "Yes";
                session.accountNum = "";
                for (let i in data){
                    let d = data[i].accountNumber;
                    session.accountNum += d + ","
                }
                session.accountNum = session.accountNum.slice(0,-1)
            } else {
                session.multipleAcc = "No";
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
            }
        } else {
            session.val = "Number incorrect please try again.";
        }
        callback(session)
    };

    this.run = function (session, callback) {
        if(session.loginAuthenticated == 'Yes'){
            meta.outageAuthenticatedGet.url = meta.outageAuthenticatedGet.url.replace("?accountNumber",session.account_number);
            HttpService.httpRequest(meta.outageAuthenticatedGet,meta.hostName, session, function (session) {
                this.omsStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            session.phone == "" ? delete meta.outagePost.postParams.phone : delete meta.outagePost.postParams.account_number;
            HttpService.httpRequest(meta.outagePost,meta.hostName, session, function (session) {
                this.omsStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        }    
    }
}

module.exports = outageStatus;