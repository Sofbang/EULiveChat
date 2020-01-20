'use strict';
var OutageController = require("../comed/controller/outageStatus");

module.exports = {
    metadata: () => ({
        name: 'outageStatus',
        properties: {
            phonenumber: { required: true, type: 'string' },
            accountnumber: { required: true, type: 'string' },
            loginAuthenticated: { required: true, type: 'string' },
            address: {required:true, type: 'string'},
            token: {required: true, type: 'string'},
            sessionId:  {required: true, type: 'string'},
            fanResult: {required: true, type: 'string'},
        },
        supportedActions: ['Yes', 'No', 'MultipleAccounts', 'Invalid', 'OmrActive','UserNotLoggedIn']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.
        let session = {};
        session.phone = conversation.properties().phonenumber;
        session.loginAuthenticated = conversation.properties().loginAuthenticated;
        session.address = conversation.properties().address;
        session.account_number = conversation.properties().accountnumber;
        session.token = conversation.properties().token;
        session.sessionId = conversation.properties().sessionId;
        
        
        conversation.logger().info("**************Outage Status Component*****************");
        conversation.logger().info("Input parameter values: account_num: " + session.account_number);
        conversation.logger().info("Input parameter values: token: " + session.token);
        conversation.logger().info("Input parameter values: sessionId: " + session.sessionId);

        new OutageController().run(session,function (session) {
            if(session.statusCode != undefined && session.statusCode == 401){
                conversation.variable("fanResult","Your session has been expired");
                conversation.transition('UserNotLoggedIn');
                done();
            } else {
                if(session.phoneAccCheck){
                    if(session.multipleAcc == 'Yes'){
                        conversation.variable("fanResult",session.accountNum);
                        conversation.transition('MultipleAccounts');
                        done();
                    }else{
                        conversation.variable('address',session.address);
                        conversation.variable('phonenumber',session.phone);
                        conversation.variable('accountnumber',session.accountNumber);
                        conversation.variable('loginAuthenticated',session.loginAuthenticated);
                        if(session.omrStatus == "Yes"){
                            conversation.transition("OmrActive");
                            done();
                        } else {
                            if(session.outageReported == "Yes"){
                                conversation.transition("Yes")
                                done();
                            } else {
                                conversation.transition("No")
                                done();
                            }
                        }
                    
                    }
                } else {
                    conversation.transition('Invalid');
                    done();
                }
            }
        });
    }
};
