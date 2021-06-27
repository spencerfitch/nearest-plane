import React from 'react';
import {Container, Row} from 'react-bootstrap';

import PlaneAnimation from './PlaneAnimation';

class Home extends React.Component {
    render () {
        return (
        <Container fluid className="h-100 d-flex align-items-center">
            <Row className="w-100" style={{zIndex: 1}}>
                <Row className="align-items-center">
                    <h4 className="text-center">Welcome to Nearest Plane!</h4>
                    <p className="w-75 text-center m-auto mb-5">
                        Ever wanted to learn more about the planes that are flying over your head every day?
                        <br/>
                        Nearest Plane provides you with real time information about the plane closest to your current location.
                        <br/>
                        Learn about the current altitude, model, country of origin, and more of the planes in the skies above and on the ground nearby.
                    </p>
                </Row>
                <Row>
                    <a href="/nearest" className="btn btn-primary w-50 m-auto btn-lg text-white">
                        Find your Nearest Plane
                    </a>
                </Row>

            </Row>
            <PlaneAnimation />
        </Container>
        )
    }
}

export default Home;