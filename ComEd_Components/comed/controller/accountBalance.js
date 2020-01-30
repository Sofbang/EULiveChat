let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
let utility = require('../../utilities/utility');
let moment = require('moment');

function accountBalance() {
    let HttpService = new httpService();
    let Utility = new utility();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.balStatus = function (session, callback) {
        if(session.content == 401){
            session.statusCode = 401;
            callback(session)
        } else {
            let content = JSON.parse(session.content);
            if (content != undefined && content != null && content != "" && content.success){
                session.actBalance = content.data.BillingInfo.netDueAmount;
                session.actDueDate =  Utility.dateFormat(content.data.BillingInfo.dueByDate,'YYYY-MM-DD');
                session.address = content.data.address;
                session.bdate = Utility.dateFormat(content.data.BillingInfo.billDate,'YYYY-MM-DD');
                session.checkString = "success"
                callback(session)
            } else if (content != undefined && content != null && content != "" && content.success == false){
                session.checkString = "fail"
                if (content.meta.code === "FN-MULTIPLE-ACCOUNTS") {
                    session.balance = "MultipleAccounts"
                    callback(session)
                } else if (content.meta.code === "TC-ACCT-CLOSED"){
                    session.balance = "closed"
                    callback(session)
                } else {
                    session.balance = "TC-UNKNOWN"
                    callback(session)
                }
            } else {
                session.checkString = 'runTimeError';
                callback(session);
            }
        }         
    };

    this.run = function (session,conversation, callback) {
        // if(session.account_num === "${accountnumber.value}")
        //      delete metaData1.accountBalancePost.postParams.account_num
        meta.accountBalanceGet.url = meta.accountBalanceGet.url.replace("?accountNumber",session.account_num);
        HttpService.httpRequest(meta.accountBalanceGet,meta.hostName, session,conversation, function (session) {
            this.balStatus(session, function (session) {
                callback(session)
            }.bind(this));
        }.bind(this));
    }
}

module.exports = accountBalance;