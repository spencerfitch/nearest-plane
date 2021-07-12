const Utils = function () {

    /**
     * Return index of element with the minimum value.
     * This performs a standard numeric '<' comparison, so array elements 
     * must either already be numeric or converted to numeric values by 'func' argument.
     * 
     * @param {Array} arr Array to perform argmin operation on
     * @param {Function} func (Optional) function to map accross elements for comparison
     * @returns {Number} Index of element with the minimum value
     */
    this.argMin = (arr, func) => {
        if (!func) {
            func = (elem) => elem;
        }
        return arr
                .map((elem, idx) => [func(elem), idx])
                .reduce((acc, curr) => (acc[0] < curr[0] ? acc : curr))[1];
    }


    /**
     * Validate provided coordinates
     * 
     * @param {Number} lat Latitude coordinate
     * @param {Number} lon Longitude coordinate
     * @returns {Object} form of {valid: Boolean, body: Object}
     */
    this.validCoordinates = (lat, lon) => {
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
     * Convert OpenSky Plane State array to a JSON object
     * 
     * @param {Array} arr Array state for single plane
     * @returns {Object} Object of 
     */
    this.jsonifyPlaneState = (arr) => ({
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
    this.openskyLatLonString = (lat, lon, searchRadius) => {
        let lamin = Math.max(lat-searchRadius, -90);
        let lomin = Math.max(lon-searchRadius, -180);
        let lamax = Math.min(lat+searchRadius, 90);
        let lomax = Math.min(lon+searchRadius, 180);
        return `lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
    }
}

module.exports = new Utils();