var express = require('express');
var customer = express.Router();

customer.get('/customer', function(req, res) {
    res.render('customer/customer');
});

customer.post('/status/message_support', function(req, res) {
    for(var key in global.listener) {
        console.log(key);
        global.listener[key].emit(req.body.customerName, {
            message: req.body.message,
            isReply: false
        });
        global.listener[key].emit('support', {
            message: req.body.message,
            isReply: true,
            customerName: req.body.customerName
        });
    }
    res.send({
        error: false,
        result: true
    });
});

module.exports = customer;
