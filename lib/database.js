var mysql = require('mysql');
var database = {
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'comet123$',
    database: 'chat',
    supportBigNumbers: true,
    debug: false,
    queueLimit: 0,
    connectTimeout: 15000
}
var connection = mysql.createPool(database);

function Db() {}

Db.getConnection = function(fn) {
    connection.getConnection(function(err, db) {
        fn(err, db);
    });
}

Db.execute = function(qry, data, fn) {
    connection.getConnection(function(err, db) {
        db.query(qry, data, function(err, result) {
            db.release();
            fn(err, result);
        });
    });
}

module.exports = Db;
