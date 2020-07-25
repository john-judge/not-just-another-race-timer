let express = require("express");
let mysql = require('mysql');
let fs = require('fs');
let port = 50000;
var bodyParser = require('body-parser');
var jwt=require('jsonwebtoken'); // client will store a web token for auth

const app = express();

let pool = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    database : 'jmjudge2_njart_db',
    user     : 'jmjudge2_user',
    password : '^(nGbTxd{1Rp',
});

var loginController=require('./controllers/login');
var registerController=require('./controllers/register');
 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



/* authentication: check incoming requests */
function isAuthenticated(req, res, next) {
    if (req.body.token) {
        // retrieve the authorization header and parse out the web token
        let token = req.body.token;//req.headers.authorization.split(" ")[1];
        let privateKey = fs.readFileSync('./privateKey.pem', 'utf8');
        // Here we validate that the JSON Web Token is valid and has been 
        // created using the same private pass phrase
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
            
            if (err) {  
                res.status(500).json({ error: "Not Authorized" });
                //throw new Error("Not Authorized");
            }
            // if the JWT is valid, continue to endpoint
            console.log("Authenticated");
            return next();
        });
    } else {
        // No authorization header exists on request
        res.status(500).json({ error: "Not Authorized: no header" });
        console.log(req);
        //throw new Error("Not Authorized: no header");
    }
}

/* route to handle registration request */
app.post('/not-just-another-race-timer/api/register', function (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected home get as id ' + connection.threadId);
        registerController.register(req,resp,connection);
        connection.release(); // return the connection to pool
    });
});

/* route to handle login request */
app.post('/not-just-another-race-timer/api/login', function (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected home get as id ' + connection.threadId);
        loginController.login(req,resp,connection);
        connection.release(); // return the connection to pool
    });
});


app.get("/not-just-another-race-timer",function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected home get as id ' + connection.threadId);
        resp.sendFile(__dirname+"/html/home.html");
        connection.release(); // return the connection to pool
    });
});

app.post("/not-just-another-race-timer",(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        var eventFilter = "%" + req.body.eventName + "%";
        var athleteFilter = "%" + req.body.athleteName + "%";
        console.log("Filtering users: " + eventFilter + ",  " + athleteFilter);
        connection.query('SELECT eventName,name,gender,age,teamName AS Team FROM ParticipatesIn NATURAL JOIN Users NATURAL JOIN Events NATURAL JOIN Teams WHERE eventName LIKE ? AND name LIKE ?',[eventFilter,athleteFilter], (err, rows) => {
            // call back function
            connection.release(); // return the connection to pool
            if(err) throw err;
            resp.json(rows);
        });
    });
});

app.post("/not-just-another-race-timer/controllers/login",(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected login post as id ' + connection.threadId);
        loginController.login(req,resp,connection);
        connection.release(); // return the connection to pool
    });
});

app.post("/not-just-another-race-timer/controllers/register",(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected register post as id ' + connection.threadId);
        registerController.register(req,resp,connection);
        connection.release(); // return the connection to pool
    });
});

app.get("/not-just-another-race-timer/register",function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected register get as id ' + connection.threadId);
        connection.release(); // return the connection to pool
        resp.sendFile(__dirname+"/html/register.html");
    });
});

app.get("/not-just-another-race-timer/login",function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected login get as id ' + connection.threadId);
        connection.release(); // return the connection to pool
        resp.sendFile(__dirname+"/html/login.html");
    });
});

app.get("/not-just-another-race-timer/participate", function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        connection.release(); // return the connection to pool
        console.log('connected participate get as id ' + connection.threadId);
        resp.sendFile(__dirname+"/html/participate.html");
    });
});

app.post("/not-just-another-race-timer/participate",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        var queryArg = "%" + req.body.eventName + "%";
        connection.query('SELECT eventName AS Event,distance AS Distance FROM Events WHERE eventName LIKE ?',[queryArg], (err, rows) => {
            // call back function
            if(err) throw err;
            connection.release(); // return the connection to pool
            resp.json(rows);
        });
    });
});

app.get("/not-just-another-race-timer/event_manager", function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected event_manager get as id ' + connection.threadId);
        connection.release(); // return the connection to pool
        resp.sendFile(__dirname+"/html/event_manager.html");
    });
});

app.post("/not-just-another-race-timer/event_manager",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
  
        if(req.body.eventName) { // insert new event
            var newEventID;
            connection.query('INSERT INTO Events(eventName) VALUES(?)',[req.body.eventName], (err, result, fields) => {
                if(err) throw err;
                connection.release(); 
                connection.query('INSERT INTO Manages(userID,eventID) VALUES(?,?)',[req.body.userID,parseInt(result.insertId)], (err, result, fields) => {
                if(err) throw err;
                connection.release(); 
                console.log(result);
                });
            });
        }
        
        connection.query('SELECT eventName As Event,distance AS Distance,startTime AS Started FROM Events NATURAL JOIN Manages WHERE userID = ?',[req.body.userID], (err, rows) => {
            if(err) throw err;
            connection.release(); // return the connection to pool
            resp.json(rows);
        });
    });
});


app.listen(port, () => {
    console.log('Server is running at port ' + port);
});





