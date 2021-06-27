import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { FaPlane } from 'react-icons/fa';


class Navigation extends React.Component {
    render() {
        return (
        <Navbar bg="white" variant="light" style={{zIndex: 1}}>
            <Container fluid>
                <Navbar.Brand href="/" className="d-flex align-items-center">
                    <IconContext.Provider value={{className: 'text-primary', size: '30', style: {marginRight: "5px"}}}>
                        <FaPlane />
                    </IconContext.Provider>
                    <b>Nearest Plane</b>
                </Navbar.Brand>
                <Nav className="me-auto" defaultActiveKey={window.location.pathname}>
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/nearest">Nearest</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
        )
    }
}

export default Navigation;