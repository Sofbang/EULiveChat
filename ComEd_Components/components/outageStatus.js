'use strict';
var OutageController = require("../comed/controller/outageStatus");

module.exports = {
    metadata: () => ({
        name: 'outageStatus',
        properties: {
            phonenumber: { required: true, type: 'string' },
            accountnumber: { required: true, type: 'string' },
        },
        supportedActions: ['Yes', 'No']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        const phoneNumber = conversation.properties().phonenumber;
        const accountNumber = conversation.properties().accountnumber;
        conversation.logger().info("Input parameter values: phoneNumber: " + phoneNumber);
        conversation.logger().info("Input parameter values: accountNumber: " + accountNumber);
        let session = {};
        session.phone = phoneNumber;
        session.account_number = accountNumber;
        new OutageController().run(session,function (session) {
            conversation.reply(session.val).keepTurn(true).transition(session.checkString === 'Yes' ? "Yes" : "No");
            done();
        });
    }
};
