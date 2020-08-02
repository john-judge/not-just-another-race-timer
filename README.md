 # Project Description
 
  [This web application is not just another race timer.](https://wiki.illinois.edu/wiki/x/1pxHKw)
  
  [Requirements](https://wiki.illinois.edu/wiki/display/CS411SU20/Project+Track+1)
  
  [Workflow Wireframe / Outline (In Progress)](https://www.overleaf.com/7284889269njzvssfcnrqq)
  
 ## Meeting 7/25
 
For the Demo:
Create a Team
Join a Team
Rankings

Update from Event (change name) (event manager)
Unregister from ParticipatesIn
Group Rankings by Team

While building course waypoints, reject if the next point is within 100 m of other course points.
Find nearest segment between two waypoints
   If there are two nearest segments within threshold (100 m) reject
Compute normal to segment
Store currentDistance progress for the participant, and store rank

Finish conditions ( when to record finishTime):
  1) Spectated insertion within 100 m of final course waypoint.
  2) From event_manager, the manager clicks "Event is Finished"
        This sets the "isFinished" flag in Events, which finalizes results:
                  Spectated cannot be updated for this eventID
                  Triggers all extrapolations on finishTime for users who have at least 2/3 of the race finished.

# cPanel Instructions for collaborators

I've given you cPanel access to cPanel account "jmjudge2". Login with your own credentials. 

From **cPanel > Advanced > Terminal** run:

`
source /home/jmjudge2/nodevenv/not-just-another-race-timer/10/bin/activate && cd /home/jmjudge2/not-just-another-race-timer
`
 
 This will bring you to the directory which holds this repository's contents, and also activates the virtual environment. You can use cPanel's file editor from **Commonly Used Features > File Manager**, or use your own local editor and push/pull changes to this repo.
 
For edits to the web server or client side HTML/JS, create a new branch to store your commits when creating new functionality, then merge back to `master`.
 
# Web Server
  
The web server is set up with **node.js**. To run the server script from the Terminal:

`
  node app.js
`
To run it headless and (ideally) indefinitely:

`
nohup node app.js > output.log &
`
 
 Check if process is running:
`
pgrep -l "node"
`
You may need to restart the web server for changes in `node.js` to be tested.
If we find problems with the web server stopping, we may need to set up a Cron Job in cPanel.

# Client-Side Scripting
Javascript, HTML, CSS, jQuery.

To debug the client-side JS code, view the Console and debug Sources from **Chrome > CTRL + SHIFT + I**.

To have HTML changes be reflected in the web app (http://jmjudge2.web.illinois.edu/not-just-another-race-timer), you may need to restart the app from **cPanel > Software > Setup Node.js App > Restart the Application**

## Data Collection

We will be using [Google Maps Browser HTML5 Geolocation library](https://developers.google.com/maps/documentation/javascript/examples/map-geolocation).

Web server will also be capturing time stamps in response to jQuery requests.

# Database Structure 

 The Database structure (MySQL) can be edited from **cPanel > Databases > phpMyAdmin**, where 
`jmjudge2\_njart\_db `
  contains the tables used by this web app.
  
## Triggers and Stored Procedures
Both are found in **cPanel > Databases > phpMyAdmin**

Go to **cPanel > Databases > MySQL Databases** in
`jmjudge2\_njart\_db `

Stored procedures are edited in the **Routines** tab. Triggers are edited in the **Triggers** tab. Any SQL code can also be run on the database in the **SQL** tab.

## Tables Schema
This is the most up-to-date source of information on the database structure. The ER/UML diagrams that follow are out of date.

`Users(`<ins>`userID`</ins>`, name, gender, age, teamID)`
 
`ParticipatesIn(`<ins>`userID`</ins>`,`<ins>`eventID`</ins>`, bibNumber, rank, finishTime)`

`Spectates(`<ins>`userID`</ins>`, `<ins>`eventID`</ins>`, `<ins>`athleteID`</ins>`, timestamp, latitude, longitude, comment)`
 
`Events(`<ins>`eventID`</ins>`, eventName, distance, startTime, mapID)`
 
`Teams(`<ins>`teamID`</ins>`, teamName, teamCaptain)`

`Manages(`<ins>`userID`</ins>`, `<ins>`eventID`</ins>`)`

`CourseWaypoints(`<ins>`mapID`</ins>`, `<ins>`pointID`</ins>`, latitude, longitude)`

## UML Diagrams
![UML diagram actual](https://github.com/john-judge/not-just-another-race-timer/blob/master/images/autoUMLnjart.png)


## ER Diagram
![ER diagram](https://github.com/john-judge/not-just-another-race-timer/blob/master/images/Database%20ER%20--%20Race%20Timer%20(1).png)

