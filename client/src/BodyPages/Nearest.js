import React from 'react';

import NearestLoading from '../Components/NearestLoading';
import NearestError from '../Components/NearestError';
import Map from '../Components/Map';
import PlaneInformation from '../Components/PlaneInformation';

import './Nearest.css';


const baseUrl = "http://localhost:8081"

class Nearest extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            lat: null,
            lng: null,
            nearest: null,
            error: null,
            retryError: false
        };

        this.locationSuccess = this.locationSuccess.bind(this);
    }
    render () {
        if (this.state.error) return (<NearestError error={this.state.error} retry={this.state.retryError}/>);
        if (!this.state.nearest) return (<NearestLoading />);

        return (
        <div className="bg-light nearestContainer">
            <div className="nearestMap">
                <Map 
                    lat={this.state.lat}
                    lng={this.state.lng}
                    plane={this.state.nearest}/>
            </div>
            <PlaneInformation
                plane={this.state.nearest} />
        </div>
        )
    }

    componentDidMount () {
        this.requestGeolocation()
    }

    requestGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.locationSuccess, 
                (err) => {
                    console.log(err);
                    this.setState({
                        error: (<span>We encountered an unexpected error when retreiving your location.<br/><span className='fw-light'>Trying again might fix the issue.</span></span>),
                        retryError: true

                    })
                });
        } else {
            this.setState({
                error: <span>Geolocation is not supported by this browser.<br/>Please update your browser settings or use a different browser in order to use Nearest Plane.</span>,
                retry: false
            })
        }
    }

    locationSuccess (position) {
        this.fetchRetry(position, 0);
    }

    fetchRetry (position, n) {
        console.log(`Try ${n}`);
        // Maximum of 3 retry attempts for single request
        if (n >= 3) {
            this.setState({
                error: (<span>We weren't able to retrieve the plane information from our servers.<br/><span className="fw-light">Trying again might fix the issue.</span></span>),
                retryError: true
            })
            return;
        }

        fetch(`${baseUrl}/nearest?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    error: null,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    nearest: data
                })
            })
            .catch(err => this.fetchRetry(position, n+1))
    }
}

export default Nearest;