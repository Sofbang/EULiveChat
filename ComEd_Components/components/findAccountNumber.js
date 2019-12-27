'use strict';
let FindAccNumController = require("../comed/controller/findAccountNumber");

module.exports = {
    metadata: () => ({
        name: 'findAccountNumber',
        properties: {
            phonenumber: {required: true, type: 'string'},
            ssn: {required: true, type: 'string'},
            fanResult: {required: true, type: 'list'}
        },
        supportedActions: ['Fail', 'MultipleAccounts','Success']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        let session = {};
        session.phone = conversation.properties().phonenumber;//'(312) 282-1570';
        session.identifier = ssconversation.properties().ssn;
       
        new FindAccNumController().run(session, function (session) {
            if(session.checkString === "Retry"){
                console.log(session.accountNum);
                conversation./*reply(session.accountNum).keepTurn(true).*/transition("Fail");
                done();
            } else {
                if (session.multipleAcc !== "Yes") {
                    conversation.reply(session.accountNum).keepTurn(true).transition('Success');
                    done();
                } else {
                    conversation.variable("fanResult",session.accountNum);
                    conversation.transition('MultipleAccounts');
                    done();
                }
            }
        });
    }
};
