'use strict';

module.exports = {
    metadata: () => ({
        name: 'userLogin',
        properties: {
           // phonenumber: { required: true, type: 'string' },
           // accountnumber: { required: true, type: 'string' },
        },
        supportedActions: ['Yes', 'No']
    }),
    invoke: (conversation, done) => {
        // perform conversation tasks.
        console.log('Hi')
        let login  = false;
        login ? conversation.transition('Yes') : conversation.transition('No');
        done();
    }
};
