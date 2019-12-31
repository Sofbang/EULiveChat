'use strict';
let accountBalanceController = require("../comed/controller/accountBalance");

module.exports = {
    metadata: () => ({
        name: 'accountBalance',
        properties: {
            phonenumber: {required: true, type: 'string'},
            ssn: {required: true, type: 'string'},
            fanResult: {required: true, type: 'string'},
            accountnumber: {required: true, type: 'string'}
        },
        supportedActions: ['Success','MultiAccounts','WrongInformation']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        let session = {};
        session.phone = conversation.properties().phonenumber;//'(312) 282-1570';
        session.identifier = conversation.properties().ssn;
        session.account_num = conversation.properties().accountnumber;
      
        //new accountBalanceController().run(session, function (session) {
            session.checkString = 'success'
            session.balance = '$5'
            if(session.checkString == "success"){
                conversation.variable("fanResult",session.balance);
                conversation.transition('Success');
                done();
            } else {
                if (session.balance == "MultipleAccounts"){
                    conversation.transition('MultiAccounts');
                    done();
                } else if(session.balance == "closed"){
                    conversation.transition('WrongInformation');
                    done();
                } else {
                    conversation.reply("Server not responding, Please try again later");
                    done();
                }
            }
        //});
    }
};
