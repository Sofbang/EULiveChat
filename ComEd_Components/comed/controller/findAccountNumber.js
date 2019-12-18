let metaData = require('../config/config');
let httpService = require('../../services/httpservice');

function findAccNumStatus() {
    let HttpService = new httpService();


    this.checkInformation = function (session, callback) {
        let content = JSON.parse(session.content)
        let data = content.data;
        if(content.success){
            session.checkString = "Success";
            if(data.length > 1){
                session.multipleAcc = "Yes";
                session.accountNum = "";
                for (let i in data){
                    let d = data[i].AccountDetails.AccountNumber;
                    session.accountNum += d + ","
                }
                session.accountNum = session.accountNum.slice(0,-1)
            } else {
                session.multipleAcc = "No";
                session.accountNum = "Great! The account number for the account you selected is " + data[0].AccountDetails.AccountNumber
            }
        } else {
            session.checkString = "Retry";
            session.accountNum = "Yikes! Something was entered incorrectly. Can you please enter your information again?"
        }
        callback(session)
    };

    this.run = function (session, callback) {
        HttpService.httpRequest(metaData.findAccountNumberPost,metaData.hostName, session, function (session) {
            this.checkInformation(session, function (session) {
                callback(session)
            }.bind(this));
        }.bind(this));
    }
}

module.exports = findAccNumStatus;