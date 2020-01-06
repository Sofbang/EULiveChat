'use strict';
let accountBalanceController = require("../comed/controller/accountBalance");

module.exports = {
    metadata: () => ({
        name: 'payBill',
        properties: {
            actBalance: {required: true, type: 'string'},
        },
        supportedActions: ['BalanceZero','Balance<5','PayBillUserActSetupYes','PayBillUserActSetupNo']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        let session = {};
        session.actBalance = Number(conversation.properties().actBalance);
        if(session.actBalance == 0){
            conversation.transition("BalanceZero");
            done();
        } else if (session.actBalance < 5){
            conversation.transition("Balance<5");
            done();
        } else {
            //conversation.transition("PayBillUserActSetup");
            session.userAccountBackendCheck = false;
            session.userAccountBackendCheck ? conversation.transition("PayBillUserActSetupYes") : conversation.transition("PayBillUserActSetupNo");
            done();
        } 
    }
};
