# Nearest Plane
Nearest Plane is a React web app that locates and provides information about the aircraft closest to the user's current location.

## Project Goal
This was developed as a personal project after I frequently found myself looking up at the planes flying overhead and wondering what stories they had to tell. My goal in creating Nearest Plane was to provide a quick, intuitive platform for hearing these stories and learning a little more about the planes that fly above our heads every day. 

## Technical Details
This application is composed of an intuitive React front-end and a minor Express back-end.

Upon arriving on the animated landing page of the React front-end, the users can click a button to begin locating the plane nearest to them. At this point, a request is made to access their location through their browser, which is required to determine their location for the service. After receiving the user's location, a request is made to the Express back-end of the application that uses plane telemetry data from the [OpenSky Network](https://opensky-network.org/) to determine which plane is closest to the location of user. The information for this plane is then repackaged and delivered to the React front-end, where it is interpreted and displayed to the user through both an interactive Google Maps element and a textual layout.
