import { Container } from 'react-bootstrap'
import { IconContext } from 'react-icons';
import { BiErrorAlt } from 'react-icons/bi';

const Error = ({ error, retry }) => (
  <Container fluid className="h-100 d-flex flex-column justify-content-center">
    <Container fluid className="d-flex align-items-center justify-content-center mb-2">
      <IconContext.Provider value={{className:'text-primary', size: '40', style:{marginRight: '5px'}}}>
        <BiErrorAlt />
      </IconContext.Provider>
      <span className="fw-bold fs-4 ">
        Uh-oh, this is an error
      </span>
    </Container>
    <p className="text-center">
      { error }
    </p>
    {retry && (
      <a href='/nearest' className='btn btn-primary text-white w-25 mx-auto'>
        Retry
      </a>
    )}          
  </Container>
);

export default Error;