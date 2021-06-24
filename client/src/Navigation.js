import React from 'react';
import {Container, Navbar, Nav} from 'react-bootstrap';


class Navigation extends React.Component {
    render() {
        return (
        <Navbar bg="light" variant="light">
            <Container fluid bg="primary">
                <Navbar.Brand href="/">Nearest Plane</Navbar.Brand>
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