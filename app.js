var http = require('http');
var mysql = require('mysql');


var connection = mysql.createConnection({
    host     : 'localhost',
    database : 'jmjudge2_njart_db',
    user     : 'jmjudge2_user',
    password : '^(nGbTxd{1Rp',
});

var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var message = 'Created server with:',
        version = 'NodeJS ' + process.versions.node + '\n',
        response = [message, version].join('\n');
    res.end(response);
});
server.listen();


/*
connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected as id ' + connection.threadId);
});


connection.end();
*/