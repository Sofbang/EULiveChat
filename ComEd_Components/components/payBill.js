'use strict';
let payBillController = require("../comed/controller/payBill");

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
            accountnumber: {required: true, type: 'string'}
        },
        supportedActions: ['BalanceZero','Balance<5','PayBillUserActSetupYes','PayBillUserActSetupNo', 'Yes', 'No']
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


        if(session.payBillPaymentApiFlag == "No"){
            if(session.payment_amount == 0){
                conversation.transition("BalanceZero");
                done();
            } else if (session.payment_amount < 5){
                conversation.transition("Balance<5");
                done();
            } else {
                new payBillController().run(session,function(session){
                    conversation.variable('actBalance',session.payment_amount);
                    conversation.variable('accountnumber',session.accountNumber);
                    conversation.variable('payBillWalletResult',session.payBillWalletResult);
                    conversation.variable('payBillPaymentCategoryType',session.payment_category_type);
                    conversation.variable('payBillWalletId',session.wallet_id);
                    conversation.variable('payBillWalletItemId',session.wallet_item_id);
                    conversation.variable('payBillMaskedAccountNumber',session.masked_wallet_item_account_number);
                    session.userAccountBackendCheck ? conversation.transition("PayBillUserActSetupYes") : conversation.transition("PayBillUserActSetupNo");
                    done();
                })
            } 
        } else {
            new payBillController().run(session,function(session){
                conversation.variable('actBalance',session.payment_amount)
                console.log(session.paymentSuccess)
                session.paymentSuccess ? conversation.transition("Yes") : conversation.transition("No");
                done();
            })
        }
        
    }
};
