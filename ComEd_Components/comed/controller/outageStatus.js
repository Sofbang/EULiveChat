let metaData = require('../config/config');
let httpService = require('../../services/httpservice');

function outageStatus() {
    let HttpService = new httpService();


    this.omsStatus = function (session, callback) {
        /*session.content = {
            "success": true,
            "data": [
                {
                    "accountNumber": "6908215007",
                    "maskedAccountNumber": "******5007",
                    "contactHomeNumber": "(630) 323-2189",
                    "flagGasOnly": false,
                    "accounts": null,
                    "address": "148 TOMLIN CIR BURR RIDGE IL 60527",
                    "maskedAddress": "148 TOML",
                    "addressNumber": "148",
                    "addressName": "TOMLIN",
                    "isPasswordProtected": false,
                    "isUserAuthenticated": true,
                    "outageReported": "As of 3:33 AM on 12/12/2019 we indicate that 1 customer(s) are affected by a power outageStatus in your area. The cause of your outageStatus is under investigation. We apologize for any inconvenience it may have caused you. We are currently in the process of estimating when service will be restored.",
                    "status": "NOT_ACTIVE",
                    "plannedOutages": null,
                    "smartMeterStatus": true,
                    "flagFinaled": false,
                    "flagNoPay": false
                }
            ]
        };*/
        let data = JSON.parse(session.content).data[0];
        if(JSON.parse(session.content).success){
            if (data.status === "ACTIVE") {
                if (data.outageReported !== undefined && data.outageReported !== null && data.outageReported !== "") {
                    session.val = data.outageReported;
                    session.checkString = 'Yes'
                } else {
                    session.val = 'Power is out at ' + data.address;
                    session.checkString = 'No'
                }
            }
        } else {
            session.val = "Number incorrect please try again.";
        }
        callback(session)
    };

    this.run = function (session, callback) {
        session.phone == "" ? delete metaData.outagePost.postParams.phone : delete metaData.outagePost.postParams.account_number
        HttpService.httpRequest(metaData.outagePost, session, function (session) {
            this.omsStatus(session, function (session) {
                callback(session)
            }.bind(this));
        }.bind(this));
    }
}

module.exports = outageStatus;