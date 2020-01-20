'use strict';
let payBillController = require("../comed/controller/payBill");
let utility = require("../utilities/utility");
let Utility = new utility();

module.exports = {
    metadata: () => ({
        name: 'payBill',
        properties: {
            actBalance: {required: true, type: 'string'},
            payBillWalletResult: {required: true, type: 'string'},
            payBillPaymentCategoryType: {required: true, type: 'string'},
            payBillWalletId: {required: true, type: 'string'},
            payBillWalletItemId: {required: true, type: 'string'},
            payBillPaymentApiFlag: {required: true, type: 'string'},
            payBillMaskedAccountNumber: {required: true, type: 'string'},
            accountnumber: {required: true, type: 'string'},
            token: {required: true, type: 'string'},
            sessionId:  {required: true, type: 'string'},
            fanResult: {required: true, type: 'string'}
        },
        supportedActions: ['BalanceZero','Balance<5','PayBillUserActSetupYes','PayBillUserActSetupNo', 'Yes', 'No', 'Fail', 'Duplicate', 'UserNotLoggedIn']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        let session = {};
        session.payment_amount = Number(conversation.properties().actBalance);
        session.payBillwalletResult = conversation.properties().payBillWalletResult;
        session.payment_category_type = conversation.properties().payBillPaymentCategoryType;
        session.wallet_id = conversation.properties().payBillWalletId;
        session.wallet_item_id = conversation.properties().payBillWalletItemId;
        session.payBillPaymentApiFlag = conversation.properties().payBillPaymentApiFlag;
        session.masked_wallet_item_account_number = conversation.properties().payBillMaskedAccountNumber;
        session.payment_date = new Date();
        session.accountNumber =  conversation.properties().accountnumber;
        session.token = conversation.properties().token;
        session.sessionId = conversation.properties().sessionId;
        
        conversation.logger().info("**************Pay Bill Component*****************");
        conversation.logger().info("Input parameter values: account_num: " + session.accountNumber);
        conversation.logger().info("Input parameter values: token: " + session.token);
        conversation.logger().info("Input parameter values: sessionId: " + session.sessionId);

        let loginCheck = Utility.userLoginCheck(session.accountNumber,session.token,session.sessionId);
        
        if(loginCheck){
            if(session.payBillPaymentApiFlag == "No"){
                if(session.payment_amount == 0){
                    conversation.transition("BalanceZero");
                    done();
                } else if (session.payment_amount < 5){
                    conversation.transition("Balance<5");
                    done();
                } else {
                    new payBillController().run(session,function(session){
                        if(session.statusCode != undefined && session.statusCode == 401){
                            conversation.variable("fanResult","Your session has been expired");
                            conversation.transition('UserNotLoggedIn');
                            done();
                        } else {
                            conversation.variable('actBalance',session.payment_amount);
                            conversation.variable('accountnumber',session.accountNumber);
                            conversation.variable('payBillWalletResult',session.payBillWalletResult);
                            conversation.variable('payBillPaymentCategoryType',session.payment_category_type);
                            conversation.variable('payBillWalletId',session.wallet_id);
                            conversation.variable('payBillWalletItemId',session.wallet_item_id);
                            conversation.variable('payBillMaskedAccountNumber',session.masked_wallet_item_account_number);
            
                            if(session.userAccountBackendCheck){
                                conversation.transition("PayBillUserActSetupYes");
                                done();
                            } else {
                                conversation.transition("PayBillUserActSetupNo");
                                done();
                            }
                        }
                    })
                } 
            } else {
                new payBillController().run(session,function(session){
                    if(session.statusCode != undefined && session.statusCode == 401){
                        conversation.variable("fanResult","Your session has been expired");
                        conversation.transition('UserNotLoggedIn');
                        done();
                    } else {
                        conversation.variable('actBalance',session.payment_amount)
            
                        conversation.logger().info(session.content);
                        if(session.paymentSuccess == 'success'){
                            conversation.transition("Yes");
                            done()
                        } else if(session.paymentSuccess == 'duplicate'){
                            conversation.transition("Duplicate");
                            done();
                        } else {
                            conversation.transition("No");
                            done();
                        }
                    }
                })
            }
        } else {
            conversation.variable("fanResult","You are not signed in");
            conversation.transition('UserNotLoggedIn');
            done();
        }   
    }
};
