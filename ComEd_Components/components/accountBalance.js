'use strict';
let accountBalanceController = require("../comed/controller/accountBalance");

module.exports = {
    metadata: () => ({
        name: 'accountBalance',
        properties: {
            phonenumber: {required: true, type: 'string'},
            ssn: {required: true, type: 'string'},
            fanResult: {required: true, type: 'string'},
            accountnumber: {required: true, type: 'string'}
        },
        supportedActions: ['Success','MultiAccounts','AccountBalance']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        const phoneNumber = conversation.properties().phonenumber;
        const ssn = conversation.properties().ssn;
        const accountNumber = conversation.properties().accountnumber;

        conversation.logger().info("Input parameter values: phoneNumber: " + phoneNumber);
        conversation.logger().info("Input parameter values: ssn: " + ssn);
        conversation.logger().info("Input parameter values: accountNumber: " + accountNumber);

        let session = {};
        session.phone = phoneNumber;//'(312) 282-1570';
        session.identifier = ssn;
        session.account_num = accountNumber;
        new accountBalanceController().run(session, function (session) {
            if(session.checkString == "success"){
                conversation.variable("fanResult",session.balance);
                conversation.transition('Success');
                done();
            } else {
                if (session.balance == "MultipleAccounts"){
                    conversation.transition('MultiAccounts');
                    done();
                } else if(session.balance == "closed"){
                    conversation.reply("Account Closed, Please try with different information")
                    .keepTurn(true).transition('AccountBalance');
                    done();
                } else {
                    conversation.reply("Server not responding, Please try again later");
                    done();
                }
            }
        });
    }
};
