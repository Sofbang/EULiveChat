let metaData = require('../config/config');
let httpService = require('../../services/httpservice');

function outageStatus() {
    let HttpService = new httpService();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.omsStatus = function (session, callback) {
        if(session.content == 401){
            session.statusCode = 401;
            callback(session)
        } else {
            let content = JSON.parse(session.content)
            let data = content.meta != undefined && content.meta.code == "FN-ACCT-MULTIPLE" ? content.data : content.data != undefined && content.data.length > 0 ? content.data[0] : content;
            if(content.success){
                conversation.logger().info("Outage Check Status Api Success at omsStatus method");
                session.phoneAccCheck = true;
                if(data.length > 1){
                    conversation.logger().info("Outage Check Status Api Multiple Accounts at omsStatus method");
                    session.multipleAcc = "Yes";
                    session.accountNum = "";
                    for (let i in data){
                        let d = data[i].accountNumber;
                        session.accountNum += d + ","
                    }
                    session.accountNum = session.accountNum.slice(0,-1)
                    callback(session)
                } else {
                    conversation.logger().info("Outage Check Status Api Single Account at omsStatus method");
                    session.phone = data.contactHomeNumber;
                    session.accountNumber = data.accountNumber;
                    session.maskedAccountNumber = data.maskedAccountNumber.slice(-4);
                    session.maskedAddress = data.maskedAddress;
                    session.multipleAcc = "No";
                    if (data.status === "NOT ACTIVE") {
                        conversation.logger().info("Outage Check Status Api Oms Status Not Active at omsStatus method");
                        session.omrStatus = 'No';
                        if (data.outageReported !== undefined && data.outageReported !== null && data.outageReported !== "") {
                            conversation.logger().info("Outage Check Status Api Outage Reported at omsStatus method");
                            session.outageReported = 'Yes'
                            callback(session)
                        } else {
                            conversation.logger().info("Outage Check Status Api Outage Not Reported at omsStatus method");
                            session.address =  data.address;
                            session.outageReported = 'No'
                            callback(session)
                        }
                    } else {
                        conversation.logger().info("Outage Check Status Api Omr Status  Active at omsStatus method");
                        session.omrStatus = 'Yes';
                        session.address =  data.address;
                        callback(session)
                    }
                }
            } else {
                conversation.logger().info("Outage Check Status Api Failed at omsStatus method");
                session.phoneAccCheck = false;
                callback(session)
            }
        }
    };

    this.run = function (session,conversation, callback) {
        if(session.loginAuthenticated == 'Yes'){
            meta.outageAuthenticatedGet.url = meta.outageAuthenticatedGet.url.replace("?accountNumber",session.account_number);
            HttpService.httpRequest(meta.outageAuthenticatedGet,meta.hostName, session, conversation, function (session) {
                this.omsStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            session.phone == "" ? delete meta.outagePost.postParams.phone : delete meta.outagePost.postParams.account_number;
            HttpService.httpRequest(meta.outagePost,meta.hostName, session, conversation, function (session) {
                this.omsStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        }    
    }
}

module.exports = outageStatus;