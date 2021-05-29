"use strict";

const express = require("express");
const router = express.Router();

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

router.route("/nearest")
    .get((req, res) => {
        console.log(`GET /nearest?lat=${req.query.lat}&lon=${req.query.lon}`);

        const valid = validCoordinates(req.query.lat, req.query.lon);

        if (!valid[0]) {
            // Invalid coordinates provided
            res.status(400).send(valid[1]);
            return;
        }

        res.status(200).send(valid[1]);
        return;
    })

module.exports = router;