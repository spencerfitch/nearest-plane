import React from 'react';
import { Container,Row } from 'react-bootstrap';
import { FaPlane } from 'react-icons/fa';

import './NearestLoading.css'

class NearestLoading extends React.Component {
    render() {
        return (
            <Container fluid className="h-100 d-flex align-items-center">
                <Row className="w-100">
                    <div className="planePath">
                        <FaPlane className="planeLoading"/>
                    </div>
                    <h4 className='text-center mt-2'>
                        Locating nearest plane...
                    </h4>
                </Row>
            </Container>
        )
    }
}

export default NearestLoading;