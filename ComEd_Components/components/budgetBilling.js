'use strict';
let budgetBillingController = require("../comed/controller/budgetBilling");
let utility = require("../utilities/utility");
let Utility = new utility();

module.exports = {
     metadata: () => ({
         name: 'budgetBilling',
         properties: {
            accountnumber: {required: true, type: 'string'},
            enrollment: {required:true, type: 'boolean'},
            fanResult: {required: true, type: 'string'},
            token: {required: true, type: 'string'},
            sessionId:  {required: true, type: 'string'}
         },
         supportedActions: ['Yes','No','EnrollSuccess','NotEligible','EnrolledAlready','UserNotLoggedIn', 'DefaultErrorHandler']
     }),
     invoke: (conversation, done) => {
         // perform conversation tasks.

        let session = {};
        session.enrollment = conversation.properties().enrollment;
        session.account_num = conversation.properties().accountnumber;
        session.token = conversation.properties().token;
        session.sessionId = conversation.properties().sessionId;

        conversation.logger().info("**************Budget Billing Component*****************");
        conversation.logger().info("Input parameter values: account_num: " + session.account_num, + " ,token: " + session.token + " ,sessionId: " + session.sessionId);

        let loginCheck = Utility.userLoginCheck(session.account_num,session.token,session.sessionId);

        if(loginCheck){
            new budgetBillingController().run(session,conversation, function (session) {
                if(session.statusCode != undefined && session.statusCode == 401){
                    conversation.variable("fanResult","Your session has been expired");
                    conversation.transition('UserNotLoggedIn');
                    done();
                } else {
                    if(!session.enrollment){
                        if(session.budgetEligible == 'AlreadyEnrolled'){
                            conversation.transition('EnrolledAlready');
                            done();
                        } else {
                            session.budgetEligible ? conversation.transition('Yes') : conversation.transition('No');
                            done();
                        }
                    } else {
                        if(session.resp){
                            conversation.variable('fanResult',session.enrollVal);
                            conversation.transition('EnrollSuccess');
                            done();
                        } else {
                            if(session.checkString == 'noteligible'){
                                conversation.transition('NotEligible');
                                done();
                            } else if (session.checkString == 'enrolled'){
                                conversation.transition('EnrolledAlready');
                                done();
                            } else {
                                conversation.reply("Server not responding, Please try again later.")
                                done;
                            }
                        }
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
