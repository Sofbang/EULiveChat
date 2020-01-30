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
            maskedAddress: {required: true, type: 'string'},
            maskedAccountNumber: {required: true, type: 'string'},
            omrStatus: {required: true, type: 'string'},
            outageReported: {required: true, type: 'string'}

        },
        supportedActions: ['Yes', 'No', 'MultipleAccounts', 'Invalid', 'OmrActive','UserNotLoggedIn','ContinueOutage']
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
        session.maskedAddress = conversation.properties().maskedAddress;
        session.maskedAccountNumber = conversation.properties().maskedAccountNumber;
        session.omrStatus = conversation.properties().omrStatus;
        session.outageReported = conversation.properties().outageReported;
        

        conversation.logger().info("**************Outage Status Component*****************");
        conversation.logger().info("Input parameter values: account_num: " + session.account_number);
        conversation.logger().info("Input parameter values: token: " + session.token);
        conversation.logger().info("Input parameter values: sessionId: " + session.sessionId);
        
        if(session.omrStatus != ""){
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
        } else {
            new OutageController().run(session,conversation,function (session) {
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
                            conversation.variable('maskedAddress',session.maskedAddress);
                            conversation.variable('maskedAccountNumber',session.maskedAccountNumber);
                            conversation.variable('omrStatus',session.omrStatus);
                            conversation.variable('outageReported',session.outageReported);
                            if(session.loginAuthenticated == 'Yes'){
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
                            } else {
                                conversation.transition('ContinueOutage');
                                done();
                            }
                            
                        }
                    } else {
                        conversation.transition('Invalid');
                        done();
                    }
                }
            });
        }
    }
};
