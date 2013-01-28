var SendGrid = require('sendgrid').SendGrid,
    sendgrid;

var mail = {
    init: function(config) {
        if (!sendgrid) {
            sendgrid = new SendGrid(config.user, config.key);
            mail.send = sendgrid.send.bind(sendgrid);
        }
        else
            console.warning('mail.js was initiated more then once.');
    },
    send: function(o, cb) {
        cb(false);
    }
};

module.exports = mail;