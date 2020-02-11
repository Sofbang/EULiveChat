let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
let utility = require('../../utilities/utility');
let moment = require('moment');

function accountBalance() {
    let HttpService = new httpService();
    let Utility = new utility();
    let meta = JSON.parse(JSON.stringify(metaData));

    this.balStatus = function (session, conversation, callback) {
        if (session.content == 401) {
            session.statusCode = 401;
            callback(session)
        } else {
            try {
                let content = JSON.parse(session.content);
                session.content = content;
                if (content != undefined && content != null && content != "" && content.success) {
                    conversation.logger().info("Account Balance Api Success at balStatus method");
                    session.actBalance = content.data.BillingInfo.netDueAmount;
                    session.actDueDate = content.data.BillingInfo.dueByDate != undefined ? Utility.dateFormat(content.data.BillingInfo.dueByDate, 'YYYY-MM-DD') : 'null';
                    session.address = content.data.address;
                    session.bdate = content.data.BillingInfo.billDate != undefined ? Utility.dateFormat(content.data.BillingInfo.billDate, 'YYYY-MM-DD') : 'null';
                    session.checkString = "success"
                    callback(session)
                } else if (content != undefined && content != null && content != "" && content.success == false) {
                    session.checkString = "fail";
                    conversation.logger().info("Account Balance Api Failed at balStatus method");
                    callback(session);
                } else {
                    conversation.logger().info("Account Balance Runtime Exception at balStatus method");
                    session.checkString = 'runTimeError';
                    callback(session);
                }
            } catch (err) {
                conversation.logger().info("Account Balance Runtime Exception at balStatus method");
                conversation.logger().info(err);
                session.checkString = 'runTimeError';
                callback(session);
            }
        }
    };

    this.run = function (session, conversation, done, callback) {
        meta.hostName = session.envirornment == "production" ? meta.prodHostName : session.envirornment == "stage" ? meta.stageHostName : meta.devHostName;
        conversation.logger().info("HostName: " + meta.hostName);
        meta.accountBalanceGet.url = meta.accountBalanceGet.url.replace("?accountNumber", session.account_num);
        HttpService.httpRequest(meta.accountBalanceGet, meta.hostName, session, conversation,done, function (session) {
            this.balStatus(session, conversation, function (session) {
                callback(session)
            }.bind(this));
        }.bind(this));
    }
}

module.exports = accountBalance;