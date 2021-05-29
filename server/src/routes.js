"use strict";

const express = require("express");
const axios = require("axios");
const axiosRetry = require('axios-retry');
const router = express.Router();

const openSky = axios.create({baseURL: "https://opensky-network.org/api" });

router.route("/")
    .get((req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });

const validCoordinates = (lat, lon) => {
    /*
    Check validation of the provided coordinates

    Arguments:
        lat - provided latitude
        lon - provided longitude

    Returns:
        valid (boolean)  - were the coordinates valid?
        body  (JSON)     - error response body if invalid, lat-lon if valid
    */

    // Coordinates included?
    if (!(lat && lon)) {
        const body = {
            message: "Must include both the latitude (lat) and longitude (lon) in the query parameters"
        }
        return [false, body];
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
        return [false, body]
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
            return [false, body];
        }

    // Valid coordinates provided
    const body = {
        lat: latNumber,
        lon: lonNumber
    }
    return [true, body]
}

const argMin = (arr, func) => {
    if (!func) {
        func = (elem) => elem;
    }
    return arr
            .map((elem, idx) => [func(elem), idx])
            .reduce((acc, curr) => (acc[0] < curr[0] ? acc : curr))[1];
}

router.route("/nearest")
    .get((req, res) => {
        console.log(`GET /nearest?lat=${req.query.lat}&lon=${req.query.lon}`);

        const valid = validCoordinates(req.query.lat, req.query.lon);

        if (!valid[0]) {
            // Invalid coordinates provided
            res.status(400).send(valid[1]);
            return;
        }

        // Valid coordinates provided ==> Make request to OpenSky
        const lat = valid[1].lat
        const lon = valid[1].lon

        // Starting search radius at 2 degrees, max of 32 degrees
        let searchRadius = 2;

        // Reject promise if empty states array returned
        //      - Result of search radius being too narrow
        openSky.interceptors.response.use((response) => {
            if (response.data.states.length == 0) {
                searchRadius = searchRadius*2;
                return Promise.reject();
            } else {
                return response;
            }
        })

        // Retry at most 5 times (doubling search radius each time)
        axiosRetry(openSky, {retries: 5})

        // Construct coordinate boundaries for each retry
        const latlonString = () => {
            let lamin = Math.max(lat-searchRadius, -90);
            let lomin = Math.max(lon-searchRadius, -180);
            let lamax = Math.min(lat+searchRadius, 90);
            let lomax = Math.min(lon+searchRadius, 180);
            return `lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
        }
        // Make request to openSky API
        openSky.get(`/states/all?${latlonString()}`)
            .then(response => response.data)
            .then(data => {
                let states = data.states;
                const dist = (state) => Math.sqrt((state[5]-lon)**2 + (state[6]-lat)**2);
                
                // Transfer array data to JSON response
                const nearest = states[argMin(states, dist)];
                const body = {
                    icao24: nearest[0],
                    callsign: nearest[1],
                    origin_country: nearest[2],
                    time_position: nearest[3],
                    last_contact: nearest[4],
                    longitude: nearest[5],
                    latitude: nearest[6],
                    baro_altitude: nearest[7],
                    on_ground: nearest[8],
                    velocity: nearest[9],
                    true_track: nearest[10],
                    vertical_rate: nearest[11],
                    sensors: nearest[12],
                    geo_altitude: nearest[13],
                    squawk: nearest[14],
                    spi: nearest[15],
                    position_source: nearest[16]
                }
                res.status(200).send(body);
                return;
            })
            .catch(err => {
                console.log("Error in reques to to OpenSky:\n"+err);
            })            
    })

module.exports = router;