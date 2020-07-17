This web application is not just another race timer.

# cPanel Instructions for collaborators
I've given you cPanel access to cPanel account "jmjudge2". Login with your own credentials. 

From **cPanel > Advanced > Terminal** run:

`
source /home/jmjudge2/nodevenv/not-just-another-race-timer/10/bin/activate && cd /home/jmjudge2/not-just-another-race-timer
`
 
 This will bring you to the directory which holds this repository's contents, and also activates the virtual environment. You can use cPanel's file editor from Commonly Used Features > File Manager, or use your own local text editor and push/pull changes to this repo.
 
 The Database structure (MySQL) can be edited from **cPanel > Databases > phpMyAdmin**, where 
`jmjudge2\_njart\_db `
  contains the tables. 
  
The web server is set up with **node.js**. To run the server script from the Terminal:

`
  node app.js
`
  
To have code changes be reflected in the web app (http://jmjudge2.web.illinois.edu/not-just-another-race-timer), you need to restart the app from **cPanel > Software > Setup Node.js App > Restart the Application**

Please create a new branch to store your commits when creating new functionality, then merge back to `master` when confirmed to work.

# Tables

`Users(`<ins>`userID`</ins>`, name, gender, age, teamID)`
 
`ParticipatesIn(`<ins>`userID`</ins>`,`<ins>`eventID`</ins>`, rank)`

`Spectates(`<ins>`userID`</ins>`, `<ins>`eventID`</ins>`, `<ins>`athleteID`</ins>`, timestamp, latitude, longitude, comment)`
 
`Events(`<ins>`eventID`</ins>`, eventName, distance, startTime, mapID)`
 
`Teams(`<ins>`teamID`</ins>`, teamName, score, teamCaptain)`

`Manages(`<ins>`userID`</ins>`, `<ins>`eventID`</ins>`)`

`CourseWaypoints(`<ins>`mapID`</ins>`, `<ins>`pointID`</ins>`, latitude, longitude)`

# ER Diagram
![ER diagram](https://github.com/john-judge/not-just-another-race-timer/blob/master/images/Database%20ER%20--%20Race%20Timer%20(1).png)

# UML Diagram
![UML diagram](https://github.com/john-judge/not-just-another-race-timer/blob/master/images/UML_race_timer.png)
