'use strict';

let ChatSurveyController = require("../comed/controller/chatSurvey"); 

module.exports = {
    metadata: () => ({
        name: 'chatSurvey',
        properties: {
            rating: { required: true, type: 'int' },
            chatSurveyComments: {required: true, type: 'string'}
        },
        supportedActions: ['Success', 'Fail']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        let session = {};
        session.rating = conversation.properties().rating;
        session.comments = conversation.properties().chatSurveyComments;
        session.userName = ""
        
        conversation.logger().info("**************Chat Survey Component*****************");
        conversation.logger().info("Input parameter values: rating: " + session.rating);
        conversation.logger().info("Input parameter values: comments: " + session.comments);
        
        new ChatSurveyController().run(session,function(session){
            if(session.content == "True"){
                conversation.transition("Success");
                done();
            } else {
                conversation.transition("Fail");
                done();
            }
        }); 
    }
};
