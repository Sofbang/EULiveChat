let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
let utility = require('../../utilities/utility');
let _ = require('lodash')

function payBill() {
    let HttpService = new httpService();
    let Utility = new utility();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.payBillStatus = function (session, callback) {
        if(session.content == 401){
            session.statusCode = 401;
            callback(session)
        } else {
            let content = JSON.parse(session.content);
            if(content.success){
                session.apiCheck = true;
                if(content.data.WalletItems.length > 0){
                    //content.data.WalletItems[0].isDefault = true;
                    let isDefaultData = _.filter(content.data.WalletItems,function(e){
                        return e.isDefault == true;
                    })
                    if(isDefaultData.length > 0){
                        session.userAccountBackendCheck = true; 
                        let defaultData = isDefaultData[0];
                        session.payment_category_type = defaultData.paymentCategoryType;
                        session.payBillWalletResult = defaultData.paymentMethodType + " " + defaultData.paymentCategoryType + " " + "CARD" + " " + "ending with" + " " + defaultData.maskedWalletItemAccountNumber.slice(-4);
                        session.wallet_id = defaultData.walletExternalID;
                        session.wallet_item_id = defaultData.walletItemID;
                        session.masked_wallet_item_account_number = defaultData.maskedWalletItemAccountNumber.slice(-4);
                        callback(session)
                    } else {
                        session.userAccountBackendCheck = false;
                        session.payBillWalletResult = "you have multiple accounts and don’t have one identified as the default."
                        callback(session)
                    }
                } else {
                    session.userAccountBackendCheck = false;
                    session.payBillWalletResult = "you don’t have a payment method saved under your account."
                    callback(session)
                }
            } else {
                session.apiCheck = false;
                callback(session);
            }
        }
    };

    this.createPayment = function(session,callback){
        let content = JSON.parse(session.content);
        if(content.success){
            session.paymentSuccess = 'success';
            callback(session)
        } else {
            session.paymentSuccess = content.meta.code == 'xmlPayment.duplicate' ? 'duplicate' : 'fail';
            callback(session)
        }
       
    }

    this.run = function (session, callback) {
        if (session.payBillPaymentApiFlag == "No"){
            HttpService.httpRequest(meta.payBillWalletPost,meta.hostName, session, function (session) {
                this.payBillStatus(session, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            session.payment_category_type = session.payment_category_type == "CREDIT" ? 'Card' : 'Check';
            meta.payBillCreatePaymentPost.url = meta.payBillCreatePaymentPost.url.replace("?accountNumber",session.accountNumber);
            HttpService.httpRequest(meta.payBillCreatePaymentPost,meta.hostName, session, function (session) {
                this.createPayment(session, function (session) {
                   callback(session);
                }.bind(this));
            }.bind(this));  
        }
    }
}

module.exports = payBill;