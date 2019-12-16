let metaData = require('../config/findAccountNumber');
let httpService = require('../../services/httpservice');

function findAccNumStatus() {
    let HttpService = new httpService();


    this.checkInformation = function (session, callback) {
        let content = JSON.parse(session.content)
        let data = content.data;
        if(content.success){
            if(data.length > 1){

            } else {
                session.accountNum = data[0].AccountDetails.AccountNumber
            }
        } else {
            session.checkString = "No";
            session.accountNum = "No Account Found with the given options, Please try again"
        }
        callback(session)
    };

    this.run = function (session, callback) {
        HttpService.httpRequest(metaData.findAccountNumberPost, session, function (session) {
            this.checkInformation(session, function (session) {
                callback(session)
            }.bind(this));
        }.bind(this));
    }
}

module.exports = findAccNumStatus;