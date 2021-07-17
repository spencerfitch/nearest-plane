import React from 'react';
import { Container } from 'react-bootstrap'

import { IconContext } from 'react-icons';
import { BiErrorAlt } from 'react-icons/bi';

class NearestError extends React.Component {
    render() {
        return (
            <Container fluid className="h-100 d-flex flex-column justify-content-center">
                <Container fluid className="d-flex align-items-center justify-content-center mb-2">
                    <IconContext.Provider value={{className:'text-primary', size: '40', style:{marginRight: '5px'}}}>
                        <BiErrorAlt/>
                    </IconContext.Provider>
                    <span className="fw-bold fs-4 ">
                        Uh-oh, this is an error
                    </span>
                </Container>
                <p className="text-center">
                    {this.props.error}
                </p>
                {(this.props.retry) ? <a href='/nearest' className='btn btn-primary text-white w-25 mx-auto'>Retry</a> : null}
                
            </Container>
        );
    }
}

export default NearestError;