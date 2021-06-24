import React from 'react';
import {Container} from 'react-bootstrap';


const baseUrl = "http://localhost:8081"

class Nearest extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            lat: null,
            lon: null,
            nearest: null
        };

        this.locationSuccess = this.locationSuccess.bind(this);
    }
    render () {
        return (
        <Container fluid>
            <h2>Current Location</h2>
            <p><b>Latitude:</b>  {this.state.lat}</p>
            <p><b>Longitude:</b> {this.state.lon}</p>
            <br/>
            <div>
                <h2>Plane Information:</h2> 
                <pre>
                    {(this.state.nearest) ? JSON.stringify(this.state.nearest, null, 2) : null}
                </pre>
            </div>
        </Container>
        )
    }

    componentDidMount () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.locationSuccess, (err) => {console.log(err)});
        } else {
            console.log("Geolocation is not supported by this browser");
        }
    }

    locationSuccess (position) {
        fetch(`${baseUrl}/nearest?lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    nearest: data
                })
            });
    }
}

export default Nearest;