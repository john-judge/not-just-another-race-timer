let express = require("express");
let mysql = require('mysql');
let fs = require('fs');
let port = 50000;
var bodyParser = require('body-parser');
var jwt=require('jsonwebtoken'); // client will store a web token for auth

const app = express();

let pool = mysql.createPool({
    connectionLimit : 200,
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
                console.log("Not Authorized");
                return;
                //throw new Error("Not Authorized");
            }
            // if the JWT is valid, continue to endpoint
            console.log("Authenticated");
            return next();
        });
    } else {
        // No authorization header exists on request
        res.status(500).json({ error: "Not Authorized: no header" });
        console.log("Not Authorized: no header");
        return;
        //throw new Error("Not Authorized: no header");
    }
}

/* route to handle registration request */
app.post('/not-just-another-race-timer/api/register', function (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected home get as id ' + connection.threadId);
        registerController.register(req,resp,connection);
        connection.release(); 
    });
});

/* route to handle login request */
app.post('/not-just-another-race-timer/api/login', function (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected home get as id ' + connection.threadId);
        loginController.login(req,resp,connection);
        connection.release(); 
    });
});

/* Home page, find and spectate athletes */
app.get("/not-just-another-race-timer",function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected home get as id ' + connection.threadId);
        resp.sendFile(__dirname+"/html/home.html");
        connection.release(); 
    });
});

/* Home page, find and spectate athletes */
app.post("/not-just-another-race-timer/home",isAuthenticated,(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);
        var eventFilter = "%" + req.body.eventName + "%";
        var athleteFilter = "%" + req.body.athleteName + "%";
        connection.query('SELECT eventID AS EventID, eventName AS Event, name AS Athlete, bibNumber AS BibNumber FROM ParticipatesIn p NATURAL JOIN Users NATURAL JOIN Events WHERE eventName LIKE ? OR name LIKE ?',[eventFilter,athleteFilter], (err, rows) => {
            connection.release(); 
            if(err) { console.log(err); connection.release(); return; }
            resp.json(rows);
        });
    });
});

/* Cancel registration */
app.post("/not-just-another-race-timer/cancel_registration",isAuthenticated,(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);

        connection.query('DELETE FROM ParticipatesIn WHERE eventID = ? AND userID = ?',[req.body.eventID,req.body.userID], (err, rows) => {
            connection.release(); 
            if(err) { console.log(err); connection.release(); return; }
            resp.json(rows);
        });
    });
});

/* Login submit */
app.post("/not-just-another-race-timer/controllers/login",(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected login post as id ' + connection.threadId);
        loginController.login(req,resp,connection);
        connection.release(); 
    });
});

/* Register submit */
app.post("/not-just-another-race-timer/controllers/register",(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected register post as id ' + connection.threadId);
        registerController.register(req,resp,connection);
        connection.release(); 
    });
});

/* Register page */
app.get("/not-just-another-race-timer/register",function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected register get as id ' + connection.threadId);
        connection.release(); 
        resp.sendFile(__dirname+"/html/register.html");
    });
});

/* Login page */
app.get("/not-just-another-race-timer/login",function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected login get as id ' + connection.threadId);
        connection.release(); 
        resp.sendFile(__dirname+"/html/login.html");
    });
});

/* Find and participate in event */
app.get("/not-just-another-race-timer/participate", function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        connection.release();
        console.log('connected participate get as id ' + connection.threadId);
        resp.sendFile(__dirname+"/html/participate.html");
    });
});

/* Find events to participate in */
app.post("/not-just-another-race-timer/participate",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);
        var queryArg = "%" + req.body.eventName + "%";
        connection.query('SELECT eventID AS EventID, eventName AS Event,distance AS Distance FROM Events WHERE eventName LIKE ?',[queryArg], (err, rows) => {
            // call back function
            if(err) { console.log(err); connection.release(); return; }
            connection.release(); // return the connection to pool
            resp.json(rows);
        });
    });
});

/* participate in event */
app.post("/not-just-another-race-timer/participate_insert",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);
        console.log("userID: " + req.body.userID + "  eventID: " + req.body.eventID);
        connection.query('INSERT INTO ParticipatesIn(userID,eventID) VALUES(?,?)',[req.body.userID,req.body.eventID], (err, result, fields) => {
            if(err) { console.log(err); connection.release(); return; }
            connection.release(); 
            
            console.log(result);
        });
    });
});

/* Create and edit event */
app.get("/not-just-another-race-timer/event_manager", function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected event_manager get as id ' + connection.threadId);
        connection.release(); // return the connection to pool
        resp.sendFile(__dirname+"/html/event_manager.html");
    });
});

/* Create and edit event */
app.post("/not-just-another-race-timer/event_manager",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        if(!req.body.userID) return;
        console.log('connected as id ' + connection.threadId);
  
        if(req.body.eventName) { // insert new event
            connection.query('INSERT INTO Events(eventName) VALUES(?)',[req.body.eventName], (err, result, fields) => {
                if(err) { console.log(err); connection.release(); return; }
                connection.query('INSERT INTO Manages(userID,eventID) VALUES(?,?)',[req.body.userID,parseInt(result.insertId)], (err, result, fields) => {
                if(err) { console.log(err); connection.release(); return; }
                console.log(result);
                });
            });
        }
        
        connection.query('SELECT eventID as EventID, eventName As Event,distance AS Distance,startTime AS Started FROM Events NATURAL JOIN Manages WHERE userID = ?',[req.body.userID], (err, rows) => {
            if(err) { console.log(err); connection.release(); return; }
            connection.release(); // return the connection to pool
            resp.json(rows);
        });
    });
});


/* Create and edit a team */
app.get("/not-just-another-race-timer/create_team", function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected event_manager get as id ' + connection.threadId);
        connection.release(); // return the connection to pool
        resp.sendFile(__dirname+"/html/create_team.html");
    });
});

/* Create and edit a team */
app.post("/not-just-another-race-timer/create_team",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);
  
        connection.query('INSERT INTO Teams(teamName,teamCaptain) VALUES(?,?)',[req.body.teamName,req.body.userID], (err, result, fields) => {
            if(err) { console.log(err); connection.release(); return; }
            connection.release();
            console.log("New teamID: " + result.insertId);
            /* MySQL trigger will update User to have team ID */
            resp.json(result);
        });
        
    });
});

/* Get all members of a team to which the logged in user belongs */
app.post("/not-just-another-race-timer/get_team",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);
  
        connection.query('SELECT name AS Member, teamName as Team FROM Users NATURAL JOIN Teams WHERE teamID = (SELECT teamID from Users WHERE userID = ?)',[req.body.userID], (err, rows) => {
            if(err) { console.log(err); connection.release(); return; }
            connection.release(); 
            resp.json(rows);
        });
    });
});


/* Page to find and join a team */
app.get("/not-just-another-race-timer/join_team", function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        connection.release();
        console.log('connected join_team get as id ' + connection.threadId);
        resp.sendFile(__dirname+"/html/join_team.html");
    });
});

/* Find teams */
app.post("/not-just-another-race-timer/get_teams",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);
        var queryArg = "%" + req.body.teamName + "%";
        connection.query('SELECT x.TeamID,x.Team,u2.name AS Captain,x.Members FROM (SELECT t.teamID AS TeamID, t.teamName AS Team,t.teamCaptain, COUNT(*) AS Members FROM Users u NATURAL JOIN Teams t WHERE t.teamName LIKE ? GROUP BY t.teamID) x LEFT JOIN Users u2 ON x.teamCaptain = u2.name',[queryArg], (err, rows) => {
            // call back function
            if(err) { console.log(err); connection.release(); return; }
            connection.release(); // return the connection to pool
            resp.json(rows);
        });
    });
});

/* Join a team */
app.post("/not-just-another-race-timer/join_team",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);

        connection.query('UPDATE Users SET teamID = ? WHERE userID = ?',[req.body.teamID,req.body.userID], (err, rows) => {
            // call back function
            if(err) { console.log(err); connection.release(); return; }
            connection.release(); // return the connection to pool
            resp.json(rows);
        });
    });
});

/* Rankings, see participant progress and rank for an event */
app.get("/not-just-another-race-timer/rankings",function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected home get as id ' + connection.threadId);
        resp.sendFile(__dirname+"/html/rankings.html");
        connection.release(); 
    });
});

/* Rankings, see participant progress and rank for an event */
app.post("/not-just-another-race-timer/rankings",(req,resp) => {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);
        var eventFilter = "%" + req.body.eventName + "%";
        var athleteFilter = "%" + req.body.athleteName + "%";
        console.log("Filtering users: " + eventFilter + ",  " + athleteFilter);
        connection.query('SELECT eventName,name,gender,age,teamName AS Team FROM ParticipatesIn NATURAL JOIN Users NATURAL JOIN Events NATURAL JOIN Teams WHERE eventName LIKE ? AND name LIKE ?',[eventFilter,athleteFilter], (err, rows) => {
            connection.release(); 
            if(err) { console.log(err); connection.release(); return; }
            resp.json(rows);
        });
    });
});


/* Start an event (sets startTime to now) */
app.post("/not-just-another-race-timer/start_event_timer",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);
        var now = new Date(); 
        nowISO = now.toISOString();
        // convert to MySQL datetime
        now = nowISO.split('T')[0] + ' '  + now.toTimeString().split(' ')[0]; 
        connection.query('UPDATE Events SET startTime = ? WHERE eventID = ?',[now,req.body.eventID], (err, rows) => {
            // call back function
            if(err) { console.log(err); connection.release(); return; }
            connection.release(); // return the connection to pool
            resp.json(rows);
        });
    });
});


/* End an event and trigger result finalizing (sets isFinished flag to true) */
app.post("/not-just-another-race-timer/end_event_timer",isAuthenticated, function  (req,resp) {
    pool.getConnection((err, connection) => {
        if(err) { console.log(err); connection.release(); return; }
        console.log('connected as id ' + connection.threadId);

        connection.query('UPDATE Events SET isFinished = FALSE WHERE eventID = ? AND startTime IS NOT NULL',[req.body.eventID], (err, rows) => {
            // call back function
            if(err) { console.log(err); connection.release(); return; }
            connection.release(); // return the connection to pool
            resp.json(rows);
        });
    });
});


app.listen(port, () => {
    console.log('Server is running at port ' + port);
});





