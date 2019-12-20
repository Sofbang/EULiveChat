'use strict';
let budgetBillingController = require("../comed/controller/budgetBilling");

 module.exports = {
     metadata: () => ({
         name: 'budgetBilling',
         properties: {
            accountnumber: {required: true, type: 'string'},
            enrollment: {required:true, type: 'boolean'},
            fanResult: {required: true, type: 'string'}
         },
         supportedActions: ['Yes','No','EnrollSuccess','NotEligible','EnrolledAlready']
     }),
     invoke: (conversation, done) => {
         // perform conversation tasks.

         const accountNumber = conversation.properties().accountnumber;
         const enrollment = conversation.properties().enrollment;
         conversation.logger().info("Input parameter values: accountNumber: " + accountNumber);
         conversation.logger().info("Input parameter values: enrollment: " + enrollment);
        let session = {};
        session.account_num = accountNumber;
        session.enrollment = enrollment;
        new budgetBillingController().run(session, function (session) {
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
            
        });
    }
};
