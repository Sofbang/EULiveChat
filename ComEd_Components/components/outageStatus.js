'use strict';
var OutageController = require("../comed/controller/outageStatus");

module.exports = {
    metadata: () => ({
        name: 'outageStatus',
        properties: {
            phonenumber: { required: true, type: 'string' },
            accountnumber: { required: true, type: 'string' },
            loginAuthenticated: { required: true, type: 'string' }
        },
        supportedActions: ['Yes', 'No', 'MultipleAccounts']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.
        let session = {};
        session.phone = conversation.properties().phonenumber;
        session.account_number = conversation.properties().accountnumber;
        session.loginAuthenticated = conversation.properties().loginAuthenticated;
        conversation.logger().info("Input parameter values: phoneNumber: " + session.phone);
        conversation.logger().info("Input parameter values: accountNumber: " + session.account_number);
        conversation.logger().info("Input parameter values: loginAuthenticated: " + session.loginAuthenticated);
    
        new OutageController().run(session,function (session) {

            if(session.multipleAcc == 'Yes'){
                conversation.variable("fanResult",session.accountNum);
                conversation.transition('MultipleAccounts');
                done();
            }else{
                conversation.variable('phonenumber',session.phone);
                conversation.variable('accountnumber',session.account_number);
                conversation.variable('loginAuthenticated',session.loginAuthenticated);
                conversation.reply(session.val).keepTurn(true).transition(session.checkString === 'Yes' ? "Yes" : "No");
                done();
            }
            
        });
    }
};
