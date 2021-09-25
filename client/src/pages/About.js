import React from 'react';

import { Container } from 'react-bootstrap'

class About extends React.Component {
    render() {
        return (
            <Container fluid className='bg-light' style={{maxWidth: '900px'}}>
                <h4 className="mt-4">What does Nearest Plane do?</h4>
                <p>
                    Nearest Plane gives you real-time information about the plane that is closest to your current location. 
                </p>

                <h4 className="mt-4">How does Nearest Plane work?</h4>
                <p>
                    Nearest Plane uses a combination of your browser's current location 
                    and the <a href="https://https://opensky-network.org/">OpenSky Network</a> to
                    find the plane that is closest to you at any given moment. 
                </p>
                <p>
                    In more technical terms, the React front-end (that you're looking at right now) sends a request with your location
                    to a Node.js back-end server. That Node.js server then validates the request from the front-end
                    and makes a request to the OpenSky API asking for information about aircraft in your area. Once the
                    Node.js server gets a response back from OpenSky, it determines the closest plane to your location, repackages that plane's information, and sends it on to the React front-end
                    where it can be interepreted and displayed for you to enjoy. If you still want to learn more, check out
                    the <a href="https://github.com/s-fitch/nearest-plane">Nearest Plane GitHub</a>.
                </p>

                <h4 className="mt-4">Who made Nearest Plane?</h4>
                <p>
                    I did! If you want to learn more about me, you can check out my website: <a href='https://www.spencerfitch.com'>spencerfitch.com</a>.
                </p>

                <h4 className="mt-4">Why did you make Nearest Plane?</h4>
                <p>
                    I often found myself looking up at the planes passing by in the sky above my head and wondering what stories they had to tell. My goal in creating Nearest Plane was to provide a quick, intuitive platform for hearing these storiees and learning a little more about the planes that fly above our heads every day.
                </p>
                
            </Container>
        )
    }
}
export default About;