import React from 'react';
import './App.css';

const baseUrl = "http://localhost:8081"

class App extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            "lat": null,
            "lon": null
        }
        this.locationSuccess = this.locationSuccess.bind(this);
    }

    render () {
        return (
            <div>
                <h2>Current Location</h2>
                <p><b>Latitude:</b>  {this.state.lat}</p>
                <p><b>Longitude:</b> {this.state.lon}</p>
            </div>
        )
    }

    componentDidUpdate () {
        if (this.state.lat && this.state.lon) {
            fetch(`${baseUrl}/nearest?lat=${this.state.lat}&lon=${this.state.lon}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                })
        }
    }

    componentDidMount () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.locationSuccess)
        } else {
            console.log("Geolocation is not supported by this browser");
        }
    }

    locationSuccess (position) {
        this.setState({
            "lat": position.coords.latitude,
            "lon": position.coords.longitude
        });
        return;
    }
}



export default App;