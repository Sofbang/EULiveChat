let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
let utility = require('../../utilities/utility');

function accountBalance() {
    let HttpService = new httpService();
    let Utility = new utility();
    let meta = JSON.parse(JSON.stringify(metaData))
    
    this.budgetBilling = function (session, callback) {
        let content = JSON.parse(session.content);
        content.data.enrolled = true;
        if(content.success){
            session.budgetEligible = content.data.isBudgetBillingAvailable && content.data.enrolled ? 'AlreadyEnrolled' :
            content.data.isBudgetBillingAvailable ? true : false;
        }
        callback(session)
    };

    this.budgetEnroll = function (session, callback) {
        let content = JSON.parse(session.content);
        if(content.success){
            session.resp = true
            session.enrollVal = "You've successfully enrolled in budget billing! Look for an email to confirm your enrollment soon./n" +
            "Please note the Confirmation NUmber: " + content.data.confirmationNumber + " for future reference.";
        }else{
            session.resp = false
            if(content.meta.code === "FN-NOT-ELIGIBLE"){
                session.checkString = 'noteligible'
            } else if(content.meta.code === "FN-ALREADY-ENROLLED"){
                session.checkString = 'enrolled'
            } else {
                session.checkString = 'unknown'
            }
        }
        callback(session) 
    };

    this.run = function (session, callback) {
        meta.budgetBillingGet.url = meta.budgetBillingGet.url.replace("?accountNumber",session.account_num);
        if(!session.enrollment){
            HttpService.httpRequest(meta.budgetBillingGet,meta.hostName, session, function (session) {
                this.budgetBilling(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            meta.budgetEnrollmentPut.url = meta.budgetEnrollmentPut.url.replace("?accountNumber",session.account_num);
            HttpService.httpRequest(meta.budgetEnrollmentPut,meta.hostName, session, function (session) {
                this.budgetEnroll(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        }
       
    }
}

module.exports = accountBalance;