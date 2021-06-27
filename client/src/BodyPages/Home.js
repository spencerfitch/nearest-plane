import React from 'react';
import { Container, Row } from 'react-bootstrap';

import { IconContext } from 'react-icons/lib';
import { BsExclamationCircle } from 'react-icons/bs';

import PlaneAnimation from './PlaneAnimation';

class Home extends React.Component {
    render () {
        return (
        <Container fluid className="h-100 d-flex align-items-center">
            <Row className="w-100" style={{zIndex: 1}}>
                <Row className="align-items-center">
                    <h4 className="text-center fs-1">Welcome to Nearest Plane</h4>
                    <p className="w-100 text-center m-auto mb-5 fs-4">
                        Discover the world of airplanes flying right over your head
                        <br/>
                        

                    </p>
                </Row>
                <Row className="mt-3">
                    <a href="/nearest" className="btn btn-primary w-50 m-auto btn-lg text-white">
                        Find your Nearest Plane
                    </a>
                    <Container fluid className="d-flex align-items-center justify-content-center">
                        <IconContext.Provider value={{className:'fw-light', size: 15, style:{marginRight: '3px'}}}>
                            
                            <BsExclamationCircle />
                        </IconContext.Provider>
                        <span className="fw-light fs-6">
                            Location access required
                        </span>
                    </Container>
                </Row>

            </Row>
            <PlaneAnimation />
        </Container>
        )
    }
}

export default Home;