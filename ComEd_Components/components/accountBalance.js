'use strict';
let accountBalanceController = require("../comed/controller/accountBalance");
let utility = require("../utilities/utility");
let Utility = new utility();

module.exports = {
    metadata: () => ({
        name: 'accountBalance',
        properties: {
            actBalance: {required: true, type: 'string'},
            actDueDate: {required: true, type: 'string'},
            accountnumber: {required: true, type: 'string'},
            address: {require:true, type: 'string'},
            bdate: {require:true, type: 'string'},
            payBillAccountBalanceFlag:  {required: true, type: 'string'},
            token: {required: true, type: 'string'},
            sessionId:  {required: true, type: 'string'},
            fanResult:  {required: true, type: 'string'},
            envirornment:  {required: true, type: 'string'},
            isCashOnly:  {required: true, type: 'boolean'}
        },
        supportedActions: ['Success','MultiAccounts','WrongInformation','PayBillComponent',
        'UserNotLoggedIn', 'DefaultErrorHandler', 'FnAccProtected', 'TcUserInvalid']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        let session = {};
        session.actBalance = conversation.properties().actBalance;
        session.actDueDate = conversation.properties().actDueDate;
        session.account_num = conversation.properties().accountnumber;
        session.token = conversation.properties().token;
        session.sessionId = conversation.properties().sessionId;
        session.envirornment = conversation.properties().envirornment;
        session.isCashOnly = conversation.properties().isCashOnly;
        
        
        conversation.logger().info("**************Account Balance Component*****************");
        conversation.logger().info("Input parameter values: account_num: " + session.account_num + ", token: " + session.token + ", sessionId: " + session.sessionId);
        
        
        let payBillAccountBalanceFlag = conversation.properties().payBillAccountBalanceFlag;
        
        let loginCheck = Utility.userLoginCheck(session.account_num,session.token,session.sessionId);
       
        if(loginCheck){
            new accountBalanceController().run(session,conversation,done, function (session) {
                if(session.statusCode != undefined && session.statusCode == 401){
                    conversation.variable("fanResult","Your session has been expired");
                    conversation.transition('UserNotLoggedIn');
                    done();
                } else {
                    if(session.checkString == "success"){
                        conversation.variable("actBalance",session.actBalance);
                        conversation.variable("actDueDate",session.actDueDate);
                        conversation.variable("address",session.address);
                        conversation.variable("accountnumber",session.account_num);
                        conversation.variable("bdate",session.bdate);
                        conversation.variable("isCashOnly",session.isCashOnly);
                        payBillAccountBalanceFlag === "No" ? conversation.transition('Success') : conversation.transition('PayBillComponent');
                        done();
                    } else if (session.checkString == "fail"){
                        if (session.content.meta.code == "FN-MULTIPLE-ACCOUNTS") {
                            conversation.logger().info("Account Balance Api Multiple Accounts Exception at balStatus method");
                            conversation.transition('MultiAccounts');
                            done();
                        } else if (session.content.meta.code == "TC-ACCT-CLOSED"){
                            conversation.logger().info("Account Balance Api Account Closed Exception at balStatus method");
                            conversation.transition('WrongInformation');
                            done();
                        } else if (session.content.meta.code == "FN-ACCOUNT-PROTECTED"){
                            conversation.logger().info("Account Balance Api Account Protected Exception at balStatus method");
                            conversation.transition('FnAccProtected');
                            done();
                        } else if (session.content.meta.code == "TC-USER-INVALID"){
                            conversation.logger().info("Account Balance Api User Invalid Exception at balStatus method");
                            conversation.transition('TcUserInvalid');
                            done();
                        } else {
                            conversation.logger().info("Account Balance Api Unknown Exception at balStatus method");
                            conversation.transition('TcUserInvalid');
                            done();
                        }
                    } else {
                        conversation.transition('DefaultErrorHandler');
                        done();
                    }
                }
            });
        } else {
            conversation.variable("fanResult","You are not signed in");
            conversation.transition('UserNotLoggedIn');
            done();
        }
    }
};
