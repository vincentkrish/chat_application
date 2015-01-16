var express = require('express');
var support = express.Router();

support.get('/support', function(req, res) {
    res.render('support/developer');
});

support.post('/status/message_customer', function(req, res) {
    for(var key in global.listener) {
        global.listener[key].emit(req.body.customerName, {
            message: req.body.message,
            isReply: true
        });
        global.listener[key].emit('support', {
            message: req.body.message,
            isReply: false,
            customerName: req.body.customerName
        });
    }
    res.send({
        error: false,
        result: true
    });
});

module.exports = support;
