let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
let utility = require('../../utilities/utility');

function accountBalance() {
    let HttpService = new httpService();
    let Utility = new utility();
    let metaData1 = JSON.parse(JSON.stringify(metaData))

    this.balStatus = function (session, callback) {
        let content = JSON.parse(session.content);
        if (content.success){
            session.balance = "Your current balance is " + "$" + content.data.remainingBalanceDue + ", due on "
            + Utility.dateFormat(content.data.dueByDate,'YYYY-MM-DD') + ".\n\nWould you like to pay your bill today? You can also download a PDF copy of your paper bill.";
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
        if(session.account_num === "${accountnumber.value}")
             delete metaData1.accountBalancePost.postParams.account_num
        HttpService.httpRequest(metaData1.accountBalancePost,metaData1.hostName, session, function (session) {
            this.balStatus(session, function (session) {
                callback(session)
            }.bind(this));
        }.bind(this));
    }
}

module.exports = accountBalance;