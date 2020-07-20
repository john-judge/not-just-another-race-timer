let express = require("express");
let mysql = require('mysql');
let fs = require('fs');
let port = 50000;

const app = express();

let pool = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    database : 'jmjudge2_njart_db',
    user     : 'jmjudge2_user',
    password : '^(nGbTxd{1Rp',
});

//app.use(express.bodyParser());


app.get("/not-just-another-race-timer",function  (req,resp) {
    
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM Users', (err, rows,fields) => {
            // call back function
            connection.release(); // return the connection to pool
            if(err) throw err;
            console.log(__dirname);
            resp.sendfile(__dirname+"/html/home.html");
        });
    });
	
});

app.post("/not-just-another-race-timer",(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM Users', (err, rows) => {
            // call back function
            connection.release(); // return the connection to pool
            if(err) throw err;
            resp.json(rows);
        });
    });
});



app.listen(port, () => {
    console.log('Server is running at port ' + port);
});







