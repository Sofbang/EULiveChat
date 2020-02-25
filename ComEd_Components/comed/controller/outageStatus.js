let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
var utility = require('../../utilities/utility');
var moment = require('moment');

function outageStatus() {
    let HttpService = new httpService();
    let meta = JSON.parse(JSON.stringify(metaData))
    let Utility = new utility();

    this.omsStatus = function (session, conversation, callback) {
        if (session.content == 401) {
            session.statusCode = 401;
            callback(session)
        } else {
            try {
                let content = JSON.parse(session.content)
                session.content = content;
                let data = content.meta != undefined && content.meta.code == "FN-ACCT-MULTIPLE" ? content.data : content.data != undefined && content.data.length > 0 ? content.data[0] : content;
                if (content != undefined && content != null && content != "" && content.success) {
                    conversation.logger().info("Outage Check Status Api Success at omsStatus method");
                    session.checkString = 'success';
                    if (data.length > 1 && data.length < 6) {
                        conversation.logger().info("Outage Check Status Api Multiple Accounts at omsStatus method");
                        session.storeOutageJson = data;
                        session.multipleAcc = "Yes";
                        session.multipleAccLessThan4 = "Yes";
                        session.accountNum = "";
                        for (let i in data) {
                            let d = data[i].maskedAccountNumber;
                            session.accountNum += d + ","
                        }
                        session.accountNum = session.accountNum.slice(0, -1)
                        callback(session)
                    } else if (data.length > 5){
                        session.multipleAcc = "Yes";
                        session.multipleAccLessThan4 = "No" ;
                        callback(session);
                    } else {
                        conversation.logger().info("Outage Check Status Api Single Account at omsStatus method");
                        session.phone = data.contactHomeNumber;
                        session.accountNumber = data.accountNumber;
                        session.maskedAccountNumber = data.maskedAccountNumber;
                        session.maskedAddress = data.maskedAddress;
                        session.multipleAcc = "No";
                        if (data.status === "ACTIVE") {
                            conversation.logger().info("Outage Check Status Api Oms Status Not Active at omsStatus method");
                            session.omrStatus = 'No';
                            // if (data.status === "ACTIVE") {
                            //     conversation.logger().info("Outage Check Status Api Outage Reported at omsStatus method");
                            //     session.outageReported = 'Yes'
                            //     callback(session)
                            // } else {
                                conversation.logger().info("Outage Check Status Api Outage Not Reported at omsStatus method");
                                session.address = data.address;
                                session.restorationTime = moment(moment(data.ETR).utcOffset('-06:00')).format("hh:mm:ss a") + ' on ' + moment(data.ETR).format('MM/DD/YYYY');
                                session.outageReported = 'No'
                                callback(session)
                            //}
                        } else {
                            conversation.logger().info("Outage Check Status Api Omr Status  Active at omsStatus method");
                            session.omrStatus = 'Yes';
                            session.address = data.address;
                            callback(session)
                        }
                    }
                } else if (content != undefined && content != null && content != "" && content.success == false) {
                    conversation.logger().info("Outage Check Status Api Failed at omsStatus method");
                    session.checkString = "fail";
                    callback(session)
                } else {
                    conversation.logger().info("Outage Check Status Runtime Exception at OmsStatus method");
                    session.checkString = 'runTimeError';
                    callback(session);
                }
            } catch (err) {
                conversation.logger().info("Outage Check Status Runtime Exception at budgetEnroll method");
                conversation.logger().info(err);
                session.checkString = 'runTimeError';
                callback(session);
            }
        }
    };

    this.run = function (session, conversation,done, callback) {
        meta.hostName = meta.hostName.replace("?envirornmentUrl",session.envirornment);
        conversation.logger().info("HostName: " + meta.hostName);
        if (session.loginAuthenticated == 'Yes') {
            conversation.logger().info("Calling Outage Authenticated API.")
            meta.outageAuthenticatedGet.url = meta.outageAuthenticatedGet.url.replace("?accountNumber", session.account_number);
            HttpService.httpRequest(meta.outageAuthenticatedGet, meta.hostName, session, conversation,done, function (session) {
                this.omsStatus(session, conversation, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            session.phone == "" ? delete meta.outagePost.postParams.phone : delete meta.outagePost.postParams.account_number;
            conversation.logger().info("Calling Outage UnAuthenticated API.")
            HttpService.httpRequest(meta.outagePost, meta.hostName, session, conversation,done, function (session) {
                this.omsStatus(session, conversation, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        }
    }
}

module.exports = outageStatus;