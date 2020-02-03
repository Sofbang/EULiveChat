'use strict';
var reportOutageController = require("../comed/controller/reportOutage");

module.exports = {
    metadata: () => ({
        name: 'reportOutage',
        properties: {
            phonenumber: { required: true, type: 'string' },
            noticeOutageUnusual: { required: true, type: 'string' },
            lightsOut: { required: true, type: 'string' },
            fanResult: { required: true, type: 'string' },
            loginAuthenticated: { required: true, type: 'string' },
            accountnumber: { required: true, type: 'string' },
            token: {required: true, type: 'string'},
            sessionId:  {required: true, type: 'string'}
        },
        supportedActions: ['outageReportResult','UserNotLoggedIn', 'DefaultErrorHandler']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.
        
        let session = {};
        session.phone = conversation.properties().phonenumber;
        session.outageIssue = conversation.properties().lightsOut;
        session.unusual = conversation.properties().noticeOutageUnusual;
        session.loginAuthenticated = conversation.properties().loginAuthenticated;
        session.account_number = conversation.properties().accountnumber;
        session.token = conversation.properties().token;
        session.sessionId = conversation.properties().sessionId;

        conversation.logger().info("**************Report Outage Component*****************");
        conversation.logger().info("Input parameter values: account_num: " + session.account_number, + " ,token: " + session.token + " ,sessionId: " + session.sessionId);


        new reportOutageController().run(session, conversation, function (session) {
            if(session.statusCode != undefined && session.statusCode == 401){
                conversation.variable("fanResult","Your session has been expired");
                conversation.transition('UserNotLoggedIn');
                done();
            } else {
                if(session.success){
                    conversation.variable('fanResult',"Success! Your outage report has been recorded.Here is your Confirmation Number: "+session.confirmationNumber)
                    conversation.transition('outageReportResult')
                    done();
                } else {
                    if(session.checkString == "Invalid Account Number"){
                        conversation.variable('fanResult',"Invalid Account Number")
                        conversation.transition('outageReportResult')
                        done();
                    } else if(session.checkString == "UserInvalid"){
                        conversation.variable('fanResult',"Unable to parse userstring from login service")
                        conversation.transition('outageReportResult')
                        done();
                    } else {
                        conversation.variable('fanResult','Server not responding, Please try later')
                        conversation.transition('outageReportResult')
                        done();
                    }
                }
            }
        });
    }
};
