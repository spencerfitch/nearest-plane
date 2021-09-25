import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import { FaPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <Navbar bg="white" variant="light" style={{zIndex: 1}}>
    <Container fluid>
      <Navbar.Brand to="/" as={Link} className="d-flex align-items-center">
        <IconContext.Provider value={{className: 'text-primary', size: '30', style: {marginRight: "5px"}}}>
          <FaPlane />
        </IconContext.Provider>
        <b>Nearest Plane</b>
      </Navbar.Brand>
      <Nav className="me-auto" defaultActiveKey={window.location.pathname}>
        <Nav.Link href="/" to="/" as={Link}>
          Home
        </Nav.Link>
        <Nav.Link href="/nearest" to="/nearest" as={Link}>
          Nearest
        </Nav.Link>
        <Nav.Link href="/about" to="/about" as={Link}>
          About
        </Nav.Link>
      </Nav>
    </Container>
  </Navbar>
);

export default Navigation;