import { Container, Row } from 'react-bootstrap';
import { FaPlane } from 'react-icons/fa';

import '../styles/loading.css'

const Loading = ({ text }) => (
  <Container fluid className="h-100 d-flex align-items-center">
    <Row className="w-100 mx-0 mb-5">
      <div className="plane-path">
        <FaPlane className="plane-loading"/>
      </div>
      {text && (
        <h4 className='text-center mt-2'>
          {text}
        </h4>
      )}
    </Row>
  </Container>
);

export default Loading;