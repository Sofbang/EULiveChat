'use strict';
//let userLoginController = require("../comed/controller/userLogin");

module.exports = {
    metadata: () => ({
        name: 'userLogin',
        properties: {
           // phonenumber: { required: true, type: 'string' },
           // accountnumber: { required: true, type: 'string' },
        },
        supportedActions: ['Success', 'Fail']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.
        console.log('Hi')
        let login  = true;
        login ? conversation.transition('Success') : conversation.transition('Fail');
        done();
    }
};
