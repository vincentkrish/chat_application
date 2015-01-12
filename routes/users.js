var express = require('express');
var user = express.Router();
var query = require('../lib/database');

/* GET users listing. */
user.get('/', function(req, res) {
    login(req, res);
});

user.get('/login', function(req, res) {
    login(req, res)
});

function login(req, res) {
    if (req.session.user) {
        res.redirect('home');
    } else {
        res.render('index');
    }
}

user.post('/login', function(req, res) {
    query.execute('CALL validateLogin(?, ?)', [req.body.username, req.body.password],  function(err, result) {
        if (err || result[0][0].err) {
            res.redirect('back');
        } else {
            req.session.user = {};
            req.session.user = {
                userId: result[0][0].userId,
                username: result[0][0].username,
                authhash: result[0][0].authHash
            }
            res.redirect('/home');
        }

    });
});

user.get('/home', function(req, res) {
    if (req.session.user) {
        res.render('home', {user: req.session.user});
    } else {
        res.render('index');
    }
});

user.post('/comments', function(req, res) {
    for (var listener in global.userList) {
        global.userList[listener].emit('chat', {comment: req.body.comment})
    }
    // res.send({
    //     'error': false,
    //     'result': 'sssss'
    // });
});

// user.get('/comments', function(req, res) {
//     console.log(req.query);
//     console.log(Object.keys(global.userList));
// });


module.exports = user;
