let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
let utility = require('../../utilities/utility');

function accountBalance() {
    let HttpService = new httpService();
    let Utility = new utility();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.budgetBilling = function (session, conversation, callback) {
        if (session.content == 401) {
            session.statusCode = 401;
            callback(session)
        } else {
            try {
                let content = JSON.parse(session.content);
                session.content = content;
                if (content != undefined && content != null && content != "" && content.success) {
                    conversation.logger().info("Budget Billing Api Response Success at Budget Billing Method");
                    if (content.data.isBudgetBillEligible && content.data.isBudgetBill) {
                        session.budgetEligible = 'AlreadyEnrolled';
                        callback(session)
                    } else {
                        session.budgetEligible = content.data.isBudgetBillEligible ? true : false;
                        callback(session)
                    }
                } else {
                    conversation.logger().info("Budget Billing Api Response Failed at Budget Billing Method");
                    callback(session)
                }
            } catch (err) {
                conversation.logger().info("Budget Billing Runtime Exception at budgetBilling method");
                conversation.logger().info(err);
                callback(session);
            }
        }
    }

    this.budgetEnroll = function (session, conversation, callback) {
        if (session.content == 401) {
            session.statusCode = 401;
            callback(session)
        } else {
            try {
                let content = JSON.parse(session.content);
                session.content = content;
                if (content != undefined && content != null && content != "" && content.success) {
                    conversation.logger().info("Budget Billing Enrollment API Success at Budget Enroll Method");
                    session.checkString = 'success';
                    session.enrollVal = content.data.confirmationNumber;
                    callback(session)
                } else if (content != undefined && content != null && content != "" && content.success == false) {
                    conversation.logger().info("Budget Billing Enrollment API Failed at Budget Enroll Method");
                    session.resp = 'fail';
                    callback(session);
                } else {
                    conversation.logger().info("Budget Billing Runtime Exception at budgetEnroll method");
                    session.checkString = 'runTimeError';
                    callback(session);
                }
            } catch (err) {
                conversation.logger().info("Budget Billing Runtime Exception at budgetEnroll method");
                conversation.logger().info(err);
                session.checkString = 'runTimeError';
                callback(session);
            }
        }
    };

    this.run = function (session, conversation,done, callback) {
        meta.hostName = session.envirornment == "development" ? meta.devHostName : session.envirornment == "stage" ? meta.stageHostName : meta.prodHostName;
        conversation.logger().info("HostName: " + meta.hostName);
        meta.accountBalanceGet.url = meta.accountBalanceGet.url.replace("?accountNumber", session.account_num);
        if (!session.enrollment) {
            HttpService.httpRequest(meta.accountBalanceGet, meta.hostName, session, conversation,done, function (session) {
                this.budgetBilling(session, conversation, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            meta.budgetEnrollmentPut.url = meta.budgetEnrollmentPut.url.replace("?accountNumber", session.account_num);
            HttpService.httpRequest(meta.budgetEnrollmentPut, meta.hostName, session, conversation,done, function (session) {
                this.budgetEnroll(session, conversation, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        }

    }
}

module.exports = accountBalance;