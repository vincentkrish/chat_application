var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
var engine = require('ejs-locals');
app.engine('ejs', engine);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'ThisIsOurSecret#%',
    key: 'sid',
    cookie: { secure: false }
}));
app.use(require('less-middleware')(path.join(__dirname, 'public'), {force: true}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

app.use(function(req, res, next) {
    io.on('connection', function(socket) {
        if (req.session.user) {
            //global.userList[req.session.user.userId] = socket;
            global.userList[socket.id] = socket;
            // socket.on('disconnect', function(s) {
            //     console.log(Object.keys(userList).length);
            //     delete global.userList[req.session.user.userId];
            // });
        }

    });
    next();
});


app.use(users);
// app.use(account);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(req, res, next) {
    console.log(req.session);
    req.session.siteName = 'Chat Application';
    req.session.restrictRegister = true;
    next();
});

global.userList = {}
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: errl
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    console.log(11111);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// app.use(function(req, res, next) {
//     if (req.url.indexOf('/status/', -1) && req.url.indexOf('user_order_', -1)) { // to avoid unneccessary lisners count
//         res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
//         // save current page to show trade menu on only book page, this variable used in menu.ejs
//         app.locals.currentPage = req.url;

//         req.session.csrfToken = req.csrfToken();
//         app.locals.csrfToken = req.session.csrfToken;
//         io = io(server);
//         io.on('connection', function (socket) {
//             global.listeners.push(socket);
//             socket.on('tradeView', function (message) {
//                 debug('trade view' + message) ;
//             });
//         });
//     }
//     next();
// });


http.listen(3000, function() {
    console.log('listeninnnnnnnnnnnnnnnnnnnnnnnnng ');
});

module.exports = app;
