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
            fanResult:  {required: true, type: 'string'}
        },
        supportedActions: ['Success','MultiAccounts','WrongInformation','PayBillComponent','UserNotLoggedIn']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        let session = {};
        session.actBalance = conversation.properties().actBalance;
        session.actDueDate = conversation.properties().actDueDate;
        session.account_num = conversation.properties().accountnumber;
        session.token = conversation.properties().token;
        session.sessionId = conversation.properties().sessionId;
        
        conversation.logger().info("**************Account Balance Component*****************");
        conversation.logger().info("Input parameter values: account_num: " + session.account_num);
        conversation.logger().info("Input parameter values: token: " + session.token);
        conversation.logger().info("Input parameter values: sessionId: " + session.sessionId);
        
        
        let payBillAccountBalanceFlag = conversation.properties().payBillAccountBalanceFlag;
        
        let loginCheck = Utility.userLoginCheck(session.account_num,session.token,session.sessionId);
       
        if(loginCheck){
            new accountBalanceController().run(session,conversation, function (session) {
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
                        payBillAccountBalanceFlag === "No" ? conversation.transition('Success') : conversation.transition('PayBillComponent');
                        done();
                    } else if (session.checkString == "fail"){
                        if (session.balance == "MultipleAccounts"){
                            conversation.transition('MultiAccounts');
                            done();
                        } else if(session.balance == "closed"){
                            conversation.transition('WrongInformation');
                            done();
                        } else {
                            conversation.reply("Server not responding, Please try again later");
                            done();
                        }
                    } else {
                        conversation.reply("Unknown issue occured");
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
