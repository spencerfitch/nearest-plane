import { argMin, validCoordinates, jsonifyPlaneState, openskyLatLonString } from './routesUtils';
import express, { response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const router = express.Router();

router.route("/")
  .get((req, res) => {
    console.log("GET /");
    res.status(200).send({
      data: "App is running."
    });
  });

const openSky = axios.create({baseURL:  process.env.BASE_URL});
// Intercept response to check for retry conditions
openSky.interceptors.response.use((response) => (
  (response.status !== 200) ? (
    Promise.reject(`Response code of ${response.status} !== 200`)
  ) : (!response.data) ? (
    Promise.reject('Missing response body on HTTP 200 response.')
  ) : (!response.data.states || response.data.states.length === 0) ? (
    Promise.reject('Empty states array')
  ) : (
    response
  )
));

router.route("/api/nearest")
  .get((req, res) => {
    console.log(`GET /nearest?lat=${req.query.lat}&lon=${req.query.lon}`);

    const validCoord = validCoordinates(req.query.lat, req.query.lon);

    if (!validCoord.valid) {
      res.status(400).send(validCoord.body);
      return;
    }
    
    const lat = validCoord.body.lat
    const lon = validCoord.body.lon

    // Starting search radius at 2 degrees, max of 32 degrees
    let searchRadius = 2;
    const MAX_RETRY = 4;
        
    // Make request to openSky API
    const requestRetry = (currRetry) => {
      openSky.get(`/states/all?${openskyLatLonString(lat, lon, searchRadius)}`)
        .then(response => response.data)
        .then(data => {
          let states = data.states;
          const dist = (state) => Math.sqrt((state[5]-lon)**2 + (state[6]-lat)**2);
                  
          // Find nearest plane in array
          const nearest = states[argMin(states, dist)];
          // Convert State array to JSON
          const body = jsonifyPlaneState(nearest);
          res.status(200).send(body);
          return;
        })
        .catch(err => {
          console.log(`Error in request to OpenSky:\n\t${err}\n`);

          if (currRetry < MAX_RETRY) {
            console.log(`Retrying with searchRadius=${searchRadius*=2}`);
            requestRetry(currRetry+1);
          } else {
            console.log(`No successful OpenSky request after ${MAX_RETRY} attempts`);
            res.status(500).send();
            return;
          }
        }); 
    }
    requestRetry(0);             
  });

export default router;
