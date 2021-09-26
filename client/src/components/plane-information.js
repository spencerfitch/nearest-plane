import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import layouts from '../content/plane-information-layouts.json';
import labels from '../content/plane-information-labels.json';

const InformationLabel = ({ field }) => (
  <span className="d-inline-flex align-items-center">
    <OverlayTrigger placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={<Tooltip>{ labels[field].tip }</Tooltip>} >  
      <div className='fw-light'>
        { labels[field].label }
      </div>
    </OverlayTrigger>
  </span>
);

const InformationField = ({ field, content }) => (
  <Container className='m-0 p-1 text-center'>
    <div className='display-6 fs-2'>
      { String(content) }
    </div>
    <InformationLabel field={field} />
  </Container>
);

const PlaneInformation = ({ plane }) => {
  if (plane.last_contact) {
    const date = new Date(plane.last_contact*1000);
    plane.last_contact = date.toLocaleString()
  }
  const layout = (plane.on_ground) ? layouts.ground : layouts.air;
      
  return (
    <Container fluid className='m-0 p-0'>
      <div className="text-center display-6 mt-1">Plane Information</div>
      <hr className="mx-auto mb-2 mt-0 w-75" style={{height: '2px'}} />
      
      {layout.map((row, idx) => (
        <Container key={idx} fluid className='m-0 mt-2 p-0 d-flex justify-content-center'>
          
          {row.map((field) => (plane[field] && (
            <InformationField key={ field }
                field={ field }
                content={ plane[field] }/>
          )))}

        </Container>
      ))}

    </Container>  
  );  
};

export default PlaneInformation;
