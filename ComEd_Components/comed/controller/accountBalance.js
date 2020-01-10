let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
let utility = require('../../utilities/utility');

function accountBalance() {
    let HttpService = new httpService();
    let Utility = new utility();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.balStatus = function (session, callback) {
        let content = JSON.parse(session.content);
        if (content.success){
            session.actBalance = content.data.BillingInfo.netDueAmount;
            session.actDueDate =  Utility.dateFormat(content.data.BillingInfo.dueByDate,'YYYY-MM-DD');
            session.address = content.data.address;
            session.checkString = "success"
        } else {
            session.checkString = "fail"
            if (content.meta.code === "FN-MULTIPLE-ACCOUNTS") {
                session.balance = "MultipleAccounts"
            } else if (content.meta.code === "TC-ACCT-CLOSED"){
                session.balance = "closed"
            } else {
                session.balance = "TC-UNKNOWN"
            }
        }
        callback(session)        
    };

    this.run = function (session, callback) {
        // if(session.account_num === "${accountnumber.value}")
        //      delete metaData1.accountBalancePost.postParams.account_num
        meta.accountBalanceGet.url = meta.accountBalanceGet.url.replace("?accountNumber",session.account_num);
        HttpService.httpRequest(meta.accountBalanceGet,meta.hostName, session, function (session) {
            this.balStatus(session, function (session) {
                callback(session)
            }.bind(this));
        }.bind(this));
    }
}

module.exports = accountBalance;