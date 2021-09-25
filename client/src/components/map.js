import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import { IoLocationSharp } from 'react-icons/io5';
import { FaPlane } from 'react-icons/fa';


class Map extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            markers: [],
            loaded: false
        }
    }

    render() {
        return (
        <GoogleMapReact 
            bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY}}
            center={{lat: this.props.lat, lng: this.props.lng}}
            defaultZoom={10}
            style={{ height: "100%", width: "100%", position: 'relative'}}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({map, maps}) => this.mapLoaded(map, maps)}
        >        
            {(this.state.loaded) ? this.state.markers : null}
        </GoogleMapReact>
        )
    }

    mapLoaded(map, maps) {
        this.setState({
            markers: this.buildMapMarkers(),
            loaded: true
        })
    }

    componentDidUpdate(prevProps) {
        if ((this.props.lat === prevProps.lat) &&
            (this.props.lng === prevProps.lng) &&
            (this.props.plane === prevProps.plane)) {
            return;
        }

        this.setState({
            markers: this.buildMapMarkers()
        });
    }

    buildMapMarkers() {
        const markerSize = '2.25em';
        const newMarkers = [];

        newMarkers.push(
            <LocationMarker
                size={markerSize}
                lat={this.props.lat}
                lng={this.props.lng}
                key={0}
            />
            )
        if (this.props.plane) {
            newMarkers.push(
                <PlaneMarker
                    size={markerSize}
                    lat={this.props.plane.latitude} 
                    lng={this.props.plane.longitude}
                    track={this.props.plane.true_track}
                    key={1}
                />
            )
        }

        
        
        return newMarkers;
    }

}


const IconMarker = ({ size, label, icon, transform }) => (
    <div
        style={{
            width: (size) ? size : '1em',
            height: (size) ? size : '1em',
            transform: (transform) ? transform : 'translate(-50%, -50%)'
        }}
    >
        <OverlayTrigger
            placement='right'
            delay={{ show: 150, hide: 300 }}
            overlay={ <Tooltip>{label}</Tooltip>}
        >
            {icon}
        </OverlayTrigger>
    </div>
)

const LocationMarker = ({ size }) => (
    <IconMarker
        label='Your Location'
        icon={
            <IoLocationSharp
                className='text-primary'
                size={size}
            />
        }
        size={size}
        transform='translate(-50%, -95%)'
    />
)

const PlaneMarker = ({ size, track }) => (
    <IconMarker 
        label='Nearest Plane'
        icon={
            <FaPlane
                className='text-primary'
                size={size}
                style={{transform: `rotate(${track-90}deg)`}}
            />
        }
        size={size}
        transform='translate(-50%, -50%)'
    />
)


export default Map;