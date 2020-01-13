let metaData = require('../config/config');
let httpService = require('../../services/httpservice');

function userLogin() {
    let HttpService = new httpService();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.run = function (session, callback) {
        HttpService.httpRequest(meta.userLoginGet,meta.hostName, session, function (session) {
            HttpService.httpRequest(meta.userLoginPost,meta.hostName, session, function (session) {
                    console.log(session.content)
                 HttpService.httpRequest(meta.userLoginSessionGet,meta.hostName, session, function (session) {
                     console.log(session.content)
                 }.bind(this));
            }.bind(this));
        }.bind(this)); 
    }
}

module.exports = userLogin;