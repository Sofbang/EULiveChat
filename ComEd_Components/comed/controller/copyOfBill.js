let metaData = require('../config/config');
let httpService = require('../../services/httpservice');
let utility = require('../../utilities/utility');

function accountBalance() {
    let HttpService = new httpService();
    let Utility = new utility();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.pdfStatus = function (session, callback) {
          
    };

    this.run = function (session, callback) {
        meta.copyOfBillGet.url = meta.copyOfBillGet.url.replace("?accountNumber",session.account_num);
        HttpService.httpRequest(meta.copyOfBillGet,meta.hostName, session, function (session) {
            this.pdfStatus(session, function (session) {
                callback(session)
            }.bind(this));
        }.bind(this));
    }
}

module.exports = accountBalance;