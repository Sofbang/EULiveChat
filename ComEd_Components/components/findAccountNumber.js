'use strict';
let FindAccNumController = require("../comed/controller/findAccountNumber");

module.exports = {
    metadata: () => ({
        name: 'findAccountNumber',
        properties: {
            phonenumber: { required: true, type: 'string' },
            ssn: { required: true, type: 'string' },
        },
        supportedActions: ['Retry']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.

        const phoneNumber = conversation.properties().phonenumber;
        const ssn = conversation.properties().ssn;
        conversation.logger().info("Input parameter values: phoneNumber: " + phoneNumber);
        conversation.logger().info("Input parameter values: ssn: " + ssn);
        let session = {};
        session.phone = phoneNumber;
        session.identifier = ssn;
        new FindAccNumController().run(session,function (session) {
           /* var messageModel = conversation.MessageModel();
            var cards = [];
            for (var i = 0; i < 2 ; i++){
                var cardObject = messageModel.cardObject(session.accountNum, "Found More than 2 Records",
                    "", "", []);
                cards.push(cardObject);
            }



            console.log(cards)
            var cardsResponse = messageModel.cardConversationMessage('vertical', cards);
            console.log(cardsResponse)*/
            conversation.reply(session.accountNum)//.keepTurn(true).transition("Retry");
            done();
        });
    }
};
