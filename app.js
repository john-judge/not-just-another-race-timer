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
                throw new Error("Not Authorized");
            }
            // if the JWT is valid, continue to endpoint
            console.log("Authenticated");
            return next();
        });
    } else {
        // No authorization header exists on request
        res.status(500).json({ error: "Not Authorized: no header" });
        console.log(req);
        throw new Error("Not Authorized: no header");
    }
}

/* route to handle login and registration */
app.post('/not-just-another-race-timer/api/register',registerController.register);
app.post('/not-just-another-race-timer/api/login',loginController.login);

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
        connection.query('SELECT name,email,gender,age,teamID FROM Users', (err, rows) => {
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
    });
});

app.post("/not-just-another-race-timer/controllers/register",(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected register post as id ' + connection.threadId);
        registerController.register(req,resp,connection);
    });
});

app.get("/not-just-another-race-timer/register",function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected register get as id ' + connection.threadId);
        resp.sendFile(__dirname+"/html/register.html");
    });
});

app.get("/not-just-another-race-timer/login",function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected login get as id ' + connection.threadId);
        resp.sendFile(__dirname+"/html/login.html");
    });
});

app.get("/not-just-another-race-timer/participate", function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected participate get as id ' + connection.threadId);
        resp.sendFile(__dirname+"/html/participate.html");
    });
});

app.post("/not-just-another-race-timer/participate",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * FROM Events', (err, rows) => {
            // call back function
            if(err) throw err;
            resp.json(rows);
        });
    });
});


app.listen(port, () => {
    console.log('Server is running at port ' + port);
});





