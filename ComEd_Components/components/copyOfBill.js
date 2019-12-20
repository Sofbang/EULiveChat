'use strict';
var OutageController = require("../comed/controller/outageStatus");

module.exports = {
    metadata: () => ({
        name: 'copyOfBill',
        properties: {
            accountnumber: { required: true, type: 'string' }
        },
        supportedActions: ['Yes', 'No']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        
        const accountNumber = conversation.properties().accountnumber;
        
        conversation.logger().info("Input parameter values: accountNumber: " + accountNumber);
        let session = {};
        
        session.account_number = accountNumber;
        
        var messageModel = conversation.MessageModel();
        var type = 'file';
        var docUrl = 'https://www.antennahouse.com/XSLsample/pdf/sample-link_1.pdf';
        var attachmentResponse = messageModel.attachmentConversationMessage(type,docUrl)
        conversation.reply(attachmentResponse );
        done();
    }
};
