'use strict';
var ConversationLogController = require("../comed/controller/conversationLog");

module.exports = {
    metadata: () => ({
        name: 'conversationLog',
        properties: {
            email: { required: true, type: 'string' },
            fanResult: { required: true, type: 'string' }
        },
        supportedActions: ['Yes', 'No']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.
        let session = {};
        session.email = conversation.properties().email;
        
        conversation.logger().info("Input parameter values: phoneNumber: " + session.email);
       
        new ConversationLogController().run(session,function (session) {
            
        });
    }
};
