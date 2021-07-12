"use strict";

require('dotenv').config;
const express = require("express");
const axios = require("axios");
const router = express.Router();

const openSky = axios.create({baseURL:  process.env.BASE_URL});


router.route("/")
    .get((req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });

    
/**
 * Validate provided coordinates
 * 
 * @param {Number} lat Latitude coordinate
 * @param {Number} lon Longitude coordinate
 * @returns {Object} form of {valid: Boolean, body: Object}
 */
const validCoordinates = (lat, lon) => {
    const packageReturn = (valid, body) => ({valid: valid, body: body})

    // Coordinates included?
    if (!(lat && lon)) {
        const body = {
            message: "Must include both the latitude (lat) and longitude (lon) in the query parameters"
        }
        return packageReturn(false, body);
    } 

    // Coordinates numeric?
    if (isNaN(lat) || isNaN(lon)) {
        const body = {
            message: "Included latitude (lat) and longitude (lon) must be numeric",
            request: {
                lat: lat,
                lon: lon
            }
        }
        return packageReturn(false, body);
    }

    const latNumber = Number(lat);
    const lonNumber = Number(lon);
    // Coordinates in valid range?
    if (!(latNumber >= -90 && latNumber <= 90) || 
        !(lonNumber >= -180 && lonNumber <= 180)) {
            const body = {
                message: "Included latitutude must in range -90 to 90 degrees and longitude in range -180 to 180 degrees",
                request: {
                    lat: latNumber,
                    lon: lonNumber
                }
            }
            return packageReturn(false, body);
        }

    // Valid coordinates provided
    const body = {
        lat: latNumber,
        lon: lonNumber
    }
    return packageReturn(true, body)
}

/**
 * Return index of element with the minimum value.
 * This performs a standard numeric '<' comparison, so array elements 
 * must either already be numeric or converted to numeric values by 'func' argument.
 * 
 * @param {Array} arr Array to perform argmin operation on
 * @param {Function} func (Optional) function to map accross elements for comparison
 * @returns {Number} Index of element with the minimum value
 */
const argMin = (arr, func) => {
    if (!func) {
        func = (elem) => elem;
    }
    return arr
            .map((elem, idx) => [func(elem), idx])
            .reduce((acc, curr) => (acc[0] < curr[0] ? acc : curr))[1];
}

/**
 * Convert OpenSky Plane State array to a JSON object
 * 
 * @param {Array} arr Array state for single plane
 * @returns {Object} Object of 
 */
const jsonifyPlaneState = (arr) => ({
    icao24: arr[0],
    callsign: arr[1],
    origin_country: arr[2],
    time_position: arr[3],
    last_contact: arr[4],
    longitude: arr[5],
    latitude: arr[6],
    baro_altitude: arr[7],
    on_ground: arr[8],
    velocity: arr[9],
    true_track: arr[10],
    vertical_rate: arr[11],
    sensors: arr[12],
    geo_altitude: arr[13],
    squawk: arr[14],
    spi: arr[15],
    position_source: arr[16]
})

/**
 * 
 * @param {Number} lat Latitude coordinate
 * @param {Number} lon Longitude coordinate
 * @param {Number} searchRadius Search radius in degrees around coordinates
 * @returns {String} Formatted search radius string for OpenSky request
 */
const latlonString = (lat, lon, searchRadius) => {
    let lamin = Math.max(lat-searchRadius, -90);
    let lomin = Math.max(lon-searchRadius, -180);
    let lamax = Math.min(lat+searchRadius, 90);
    let lomax = Math.min(lon+searchRadius, 180);
    return `lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
}


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

        const validCoord = validCoordinates(req.query.lat, req.query.lon);

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
            openSky.get(`/states/all?${latlonString(lat, lon, searchRadius)}`)
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
                   
    })

module.exports = router;