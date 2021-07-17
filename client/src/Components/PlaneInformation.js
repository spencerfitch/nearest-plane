import React from 'react';

import { Container, OverlayTrigger, Tooltip} from 'react-bootstrap';



const rowIdentity = {
    icao24: {
        label: "ICAO 24",
        tip: "Unique ICAO 24-bit address of the transponder in hex string representation",
    },
    callsign: {
        label: "Callsign",
        tip: "Callsign of the vehicle (8 chars)"
    },
    squawk: {
        label: "Squawk",
        tip: "Assigned by air traffic controllers to identify a vehicle over radio"
    },
}
const rowCountry = {
    origin_country: {
        label: "Origin Country",
        tip: "Country name inferred from the ICAO 24-bit address"
    },
}
const rowPosition = {
    longitude: {
        label: "Longitude (°)",
        tip: "WGS-84 longitude in degrees"
    },
    latitude: {
        label: "Latitude (°)",
        tip: "WGS-84 latitude in degrees",
    },
}
const rowGround = {
    on_ground: {
        label: "On Ground",
        tip: "Whether the vehicle is currently on the ground",
    },
    last_contact: {
        label: "Last Contact",
        tip: "Timestamp of last contact from vehicle transponder",
    },
}
const rowVertMovement = {
    baro_altitude: {
        label: "Barometric Altitude (m)",
        tip: "Determined by measuring surrounding atmospheric pressure",
    },
    geo_altitude: {
        label: "Geometric Altitude (m)",
        tip: "Determined using specialized electronic equipment like GPS"
    },
    vertical_rate: {
        label: "Vertical Rate (m/s)",
        tip: "Positive value indicaes that the vehicle is climbing, while a negative value indicates that it is descending",
    },
}
const rowHorzMovement = {
    velocity: {
        label: "Velocity (m/s)",
        tip: "Velocity relative to the ground",
    },
    true_track: {
        label: "True Track",
        tip: "Degrees from North of vehicle's current heading",
    },
}
const rowContact = {
    // time_position: {
    //     label: "Last Position Update",
    //     tip: "Timestamp of last position update from vehicle",
    // },
    last_contact: {
        label: "Last Contact",
        tip: "Timestamp of last contact from vehicle transponder",
    },
}
const rowOther = {
    spi: {
        label: "Special Purpose",
        tip: "Whether flight status is marked with a special prupose indicator",
    },
    sensors: {
        label: "Sensors",
        tip: "IDs of receivers which were used to gather vehicle information",
    },
    position_source: {
        label: "Position Source",
        tip: "System used to determine vehicle's position"
    }
}

// Distinct layouts to reduce reduntant information when plane on ground
const layoutGround = [rowIdentity, rowCountry, rowPosition, rowGround, rowOther];
const layoutAir = [rowIdentity, rowCountry, rowPosition, rowVertMovement, rowHorzMovement, rowContact, rowOther];

function InformationLabel(props) {
    return (
    <span className="d-inline-flex align-items-center">
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip>{props.tip}</Tooltip>}
        >  
            <div className='fw-light'>{props.label}</div>
        </OverlayTrigger>
    </span>
    )
}

class PlaneInformation extends React.Component {
    render() {
        let plane = this.props.plane;
        if (plane.last_contact) {
            console.log(plane.last_contact)
            const date = new Date(plane.last_contact*1000);
            plane.last_contact = date.toLocaleString()
        }
        let layout = (plane.on_ground) ? layoutGround : layoutAir;
        
        return (
            <Container fluid className='m-0 p-0'>
                <div className="text-center display-6 mt-1">Plane Information</div>
                <hr className="mx-auto mb-2 mt-0 w-75" style={{height: '2px'}}/>
                {layout.map(row => {
                    return (
                    <Container fluid className='m-0 mt-2 p-0 d-flex justify-content-center'>
                        {Object.keys(row).map(key => {
                            if (!plane[key]) return null;
                            return (
                            <Container key={key} className='m-0 p-1 text-center'>
                                <div className='display-6 fs-2'>
                                    {String(plane[key])}
                                </div>
                                <InformationLabel
                                    label={row[key].label}
                                    tip={row[key].tip} />
                            </Container>
                            )})}
                    </Container>
                    )
                })}
            </Container>    
        )
    }
}


export default PlaneInformation;