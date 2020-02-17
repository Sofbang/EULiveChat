let metaData = require('../config/config');
let httpService = require('../../services/httpservice');

function reportOutage() {
    let HttpService = new httpService();
    let meta = JSON.parse(JSON.stringify(metaData))

    this.reportStatus = function (session,conversation, callback) {
        if (session.content == 401) {
            session.statusCode = 401;
            callback(session)
        } else {
            try {
                let content = JSON.parse(session.content);
                session.content = content;
                if (content != undefined && content != null && content != "" && content.success) {
                    conversation.logger().info("Report Outage Success at reportStatus method");
                    session.confirmationNumber = content.data.confirmationNumber;
                    session.checkString = 'success';
                    callback(session);
                } else if (content != undefined && content != null && content != "" && content.success == false) {
                    conversation.logger().info("Report Outage Failed at reportStatus method");
                    session.checkString = 'fail';
                    callback(session);
                } else {
                    conversation.logger().info("Report Outage Runtime Exception at reportStatus method");
                    session.checkString = 'runTimeError';
                    callback(session);
                }
            } catch (err) {
                conversation.logger().info("Report Outage Runtime Exception at reportStatus method");
                session.checkString = 'runTimeError';
                callback(session);
            }
        }
    };

    this.run = function (session, conversation,done, callback) {
        meta.hostName = session.envirornment == "production" ? meta.prodHostName : session.envirornment == "stage" ? meta.stageHostName : session.envirornment == "test" ? meta.testHostName : meta.devHostName;
        conversation.logger().info("HostName: " + meta.hostName);
        if (session.loginAuthenticated == 'Yes') {
            conversation.logger().info("Calling Report Outage Authenticated API.")
            meta.reportOutageAuthenticatedPost.url = meta.reportOutageAuthenticatedPost.url.replace("?accountNumber", session.account_number);
            HttpService.httpRequest(meta.reportOutageAuthenticatedPost, meta.hostName, session, conversation, function (session) {
                this.reportStatus(session, conversation, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        } else {
            conversation.logger().info("Calling Report Outage UnAuthenticated API.")
            HttpService.httpRequest(meta.reportOutagePost, meta.hostName, session, conversation,done, function (session) {
                this.reportStatus(session, conversation, function (session) {
                    callback(session)
                }.bind(this));
            }.bind(this));
        }
    }
}

module.exports = reportOutage;