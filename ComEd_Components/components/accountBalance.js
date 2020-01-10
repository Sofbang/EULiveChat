'use strict';
let accountBalanceController = require("../comed/controller/accountBalance");

module.exports = {
    metadata: () => ({
        name: 'accountBalance',
        properties: {
            actBalance: {required: true, type: 'string'},
            actDueDate: {required: true, type: 'string'},
            accountnumber: {required: true, type: 'string'},
            address: {require:true, type: 'string'},
            payBillAccountBalanceFlag:  {required: true, type: 'string'}
        },
        supportedActions: ['Success','MultiAccounts','WrongInformation','PayBillComponent']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        let session = {};
        session.actBalance = conversation.properties().actBalance;
        session.actDueDate = conversation.properties().actDueDate;
        session.account_num = conversation.properties().accountnumber;
        let payBillAccountBalanceFlag = conversation.properties().payBillAccountBalanceFlag;
        
        new accountBalanceController().run(session, function (session) {
            if(session.checkString == "success"){
                conversation.variable("actBalance",session.actBalance);
                conversation.variable("actDueDate",session.actDueDate);
                conversation.variable("address",session.address);
                conversation.variable("accountnumber",session.account_num);
                payBillAccountBalanceFlag === "No" ? conversation.transition('Success') : conversation.transition('PayBillComponent');
                done();
            } else {
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
            }
        });
    }
};
