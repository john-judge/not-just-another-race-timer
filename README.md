 # Project Description
 
  [This web application is not just another race timer.](https://wiki.illinois.edu/wiki/x/1pxHKw)

# cPanel Instructions for collaborators
I've given you cPanel access to cPanel account "jmjudge2". Login with your own credentials. 

From **cPanel > Advanced > Terminal** run:

`
source /home/jmjudge2/nodevenv/not-just-another-race-timer/10/bin/activate && cd /home/jmjudge2/not-just-another-race-timer
`
 
 This will bring you to the directory which holds this repository's contents, and also activates the virtual environment. You can use cPanel's file editor from **Commonly Used Features > File Manager**, or use your own local editor and push/pull changes to this repo.
 

 
# Web Server
  
The web server is set up with **node.js**. To run the server script from the Terminal:

`
  node app.js
`
  
To have code changes be reflected in the web app (http://jmjudge2.web.illinois.edu/not-just-another-race-timer), you need to restart the app from **cPanel > Software > Setup Node.js App > Restart the Application**

Test the website in browser. View the Console and debug Sources from **Chrome > CTRL + SHIFT + I**.

Please create a new branch to store your commits when creating new functionality, then merge back to `master` when confirmed to work.

# Client-Side Scripting
Will be done in Javascript.
So far we only serve `home.html`.

## Data Collection

We will be using [Google Maps Browser HTML5 Geolocation library](https://developers.google.com/maps/documentation/javascript/examples/map-geolocation).

Browser will also be capturing time stamps.

# Database Structure 

 The Database structure (MySQL) can be edited from **cPanel > Databases > phpMyAdmin**, where 
`jmjudge2\_njart\_db `
  contains the tables used by this web app.

## Tables Schema
This is the most up-to-date source of information on the database structure. The ER/UML diagrams that follow are out of date.

`Users(`<ins>`userID`</ins>`, name, gender, age, teamID)`
 
`ParticipatesIn(`<ins>`userID`</ins>`,`<ins>`eventID`</ins>`, rank)`

`Spectates(`<ins>`userID`</ins>`, `<ins>`eventID`</ins>`, `<ins>`athleteID`</ins>`, timestamp, latitude, longitude, comment)`
 
`Events(`<ins>`eventID`</ins>`, eventName, distance, startTime, mapID)`
 
`Teams(`<ins>`teamID`</ins>`, teamName, score, teamCaptain)`

`Manages(`<ins>`userID`</ins>`, `<ins>`eventID`</ins>`)`

`CourseWaypoints(`<ins>`mapID`</ins>`, `<ins>`pointID`</ins>`, latitude, longitude)`

## ER Diagram
![ER diagram](https://github.com/john-judge/not-just-another-race-timer/blob/master/images/Database%20ER%20--%20Race%20Timer%20(1).png)

## UML Diagram
![UML diagram](https://github.com/john-judge/not-just-another-race-timer/blob/master/images/UML_race_timer.png)
