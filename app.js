var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/users');
var support = require('./routes/support');
var customer = require('./routes/customer');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ioTemp = require('socket.io').listen(8081);

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

global.listener = {};
app.use(function(req, res, next) {
    if (req.url.indexOf('/status/') == -1) {
        io.on('connection', function(socket) {
                console.log('inside main');
                global.listener[socket.id] = socket;
                // socket.on('disconnect', function(socket) {
                //     //delete global.listeners[socket.id];
                // });
        });
    }
    next();
});

app.use(function(req, res, next) {
    if (req.url.indexOf('/status/') == -1) {
        ioTemp.on('connection', function(socket) {
                console.log('inside ioTempioTempioTempioTempioTempioTempioTempioTemp');
                // global.listener[socket.id] = socket;
                // socket.on('disconnect', function(socket) {
                //     //delete global.listeners[socket.id];
                // });
        });
    }
    next();
});

app.use(function(req, res, next) {
    req.session.siteName = 'Chat Application';
    req.session.restrictRegister = true;
    next();
});

app.use('/', routes);
app.use(users);
app.use(support);
app.use(customer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.listen(3000, function() {
  console.log('Express server listening on port 3000');
});


module.exports = app;
