let express = require("express");
let mysql = require('mysql');
let port = 50000;

const app = express();

let pool = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    database : 'jmjudge2_njart_db',
    user     : 'jmjudge2_user',
    password : '^(nGbTxd{1Rp',
});



app.get("/not-just-another-race-timer",(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM Users', (err, rows,fields) => {
            // call back function
            connection.release(); // return the connection to pool
            if(err) throw err;
            console.log(rows[0].userID);
            resp.json(rows);
        });
    });
});



app.listen(port, () => {
    console.log('Server is running at port ' + port);
});







