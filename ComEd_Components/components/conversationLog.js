'use strict';
var ConversationLogController = require("../comed/controller/conversationLog");

module.exports = {
     metadata: () => ({
         name: 'conversationLog',
         properties: {
             email: { required: true, type: 'string' }      
         },
         supportedActions: ['Success', 'Fail', 'Invalid']
     }),
     invoke: (conversation, done) => {
         // perform conversation tasks.
         let session = {};
         session.email = conversation.properties().email;
         session.sessionId = conversation.sessionId()
         conversation.logger().info("Input parameter values: Email: " + session.email);
         conversation.logger().info("Input parameter values: SessionId: " + session.sessionId);
     
        new ConversationLogController().run(session,function (session) {
            if(session.emailValidation){
                if(session.emailSent){
                    conversation.transition('Success');
                    done();
                } else {
                    conversation.transition('Fail')
                    done();
                }
            } else {
                conversation.transition('Invalid');
                done();
            }
        });
    }
};
