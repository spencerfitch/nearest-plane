import React from 'react';
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
        const newMarkers = [];

        newMarkers.push(
            <LocationMarker
                lat={this.props.lat}
                lng={this.props.lng}
                key={0}
            />
            )
        if (this.props.plane) {
            newMarkers.push(
                <PlaneMarker
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


const LocationMarker = () => (
    <div 
        style={{
            width: "180px",
            transform: 'translate(-5.5%, -98%)',
            fontWeight: 'bold'
        }}
    >
        <IoLocationSharp 
            className="text-primary" 
            size={20}
        />
        Your Location
    </div>
)

const PlaneMarker = ({ track }) => (
    <div 
        style={{
            width: "180px",
            transform: 'translate(-5.5%, -50%)',
            fontWeight: 'bold'
        }}
    >
        <FaPlane 
            className="text-primary" 
            size={20} 
            style={{transform: `rotate(${track-90}deg)`}}
        />
        Nearest Plane
    </div>
)


export default Map;