let metaData = require('../config/config');
let httpService = require('../../services/httpservice');

function outageStatus() {
    let HttpService = new httpService();

    this.run = function (session, callback) {
        HttpService.httpRequest(metaData.outagePost,metaData.hostName, session, function (session) {
               
        }.bind(this));
    }
}

module.exports = outageStatus;