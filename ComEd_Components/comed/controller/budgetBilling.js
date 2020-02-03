let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
let utility = require('../../utilities/utility');

function accountBalance() {
    let HttpService = new httpService();
    let Utility = new utility();
    let meta = JSON.parse(JSON.stringify(metaData))
    
    this.budgetBilling = function (session, callback) {
        if(session.content == 401){
            session.statusCode = 401;
            callback(session)
        } else {
            let content = JSON.parse(session.content);
            if(content.success){
                conversation.logger().info("Budget Billing Api Response Success at Budget Billing Method");
                session.budgetEligible = content.data.isBudgetBillingAvailable && content.data.enrolled ? 'AlreadyEnrolled' :
                content.data.isBudgetBillingAvailable ? true : false;
                callback(session)
            }
        }
    };

    this.budgetEnroll = function (session, callback) {
        if(session.content == 401){
            session.statusCode = 401;
            callback(session)
        } else {
            let content = JSON.parse(session.content);
            if(content.success){
                conversation.logger().info("Budget Billing Enrollment API Success at Budget Enroll Method");
                session.resp = true
                session.enrollVal = "You've successfully enrolled in budget billing! Look for an email to confirm your enrollment soon./n" +
                "Please note the Confirmation NUmber: " + content.data.confirmationNumber + " for future reference.";
                callback(session) 
            }else{
                session.resp = false
                if(content.meta.code === "FN-NOT-ELIGIBLE"){
                    conversation.logger().info("Budget Billing Enrollment API Not Eligible exception at Budget Enroll Method");
                    session.checkString = 'noteligible';
                    callback(session) 
                } else if(content.meta.code === "FN-ALREADY-ENROLLED"){
                    conversation.logger().info("Budget Billing Enrollment API Already Enrolled exception at Budget Enroll Method");
                    session.checkString = 'enrolled';
                    callback(session) 
                } else {
                    conversation.logger().info("Budget Billing Enrollment API Unknown exception at Budget Enroll Method");
                    session.checkString = 'unknown'
                    callback(session) 
                }
            }
        }   
    };

    this.run = function (session, conversation, callback) {
        meta.budgetBillingGet.url = meta.budgetBillingGet.url.replace("?accountNumber",session.account_num);
        if(!session.enrollment){
            HttpService.httpRequest(meta.budgetBillingGet,meta.hostName, session,conversation, function (session) {
                this.budgetBilling(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            meta.budgetEnrollmentPut.url = meta.budgetEnrollmentPut.url.replace("?accountNumber",session.account_num);
            HttpService.httpRequest(meta.budgetEnrollmentPut,meta.hostName, session,conversation, function (session) {
                this.budgetEnroll(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        }
       
    }
}

module.exports = accountBalance;