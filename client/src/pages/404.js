import { Container } from 'react-bootstrap'
import { IconContext } from 'react-icons';
import { BiErrorAlt } from 'react-icons/bi';

const NotFound = () => (
  <Container fluid className="h-100 d-flex flex-column justify-content-center">
    <Container fluid className="d-flex align-items-center justify-content-center mb-2">
      <IconContext.Provider value={{className:'text-primary', size: '40', style:{marginRight: '5px'}}}>
        <BiErrorAlt/>
      </IconContext.Provider>
      <span className="fw-bold fs-4 ">
        This page isn't what you're looking for.
      </span>
    </Container>
    <p className="text-center">
      We can't find "{window.location.pathname}" on this website. <span className="fw-light">That's all we know.</span>
      <br/>
      Use the navigation bar above to go to one of our other pages.
    </p>
  </Container>
);

export default NotFound;