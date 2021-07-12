"use strict";

require('dotenv').config;
const express = require("express");
const router = express.Router();
const axios = require("axios");

const utils = require('./routesUtils');


router.route("/")
    .get((req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });


const openSky = axios.create({baseURL:  process.env.BASE_URL});
// Intercept response to check for retry conditions
openSky.interceptors.response.use((response) => {
    if (response.status !== 200 ) {
        return Promise.reject(`Response code of ${response.status} !== 200`);
    }

    if (!response.data) {
        return Promise.reject('Missing response body on HTTP 200 response.');
    }

    if (!response.data.states
        || response.data.states.length === 0) {
            return Promise.reject('Empty states array');
    }

    return response;
})


router.route("/nearest")
    .get((req, res) => {
        console.log(`GET /nearest?lat=${req.query.lat}&lon=${req.query.lon}`);

        const validCoord = utils.validCoordinates(req.query.lat, req.query.lon);

        if (!validCoord.valid) {
            // Invalid coordinates provided
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
            openSky.get(`/states/all?${utils.openskyLatLonString(lat, lon, searchRadius)}`)
            .then(response => response.data)
            .then(data => {
                let states = data.states;
                const dist = (state) => Math.sqrt((state[5]-lon)**2 + (state[6]-lat)**2);
                
                // Find nearest plane in array
                const nearest = states[utils.argMin(states, dist)];
                // Convert State array to JSON
                const body = utils.jsonifyPlaneState(nearest);
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
                   
    })

module.exports = router;