import { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';
import { IoLocationSharp } from 'react-icons/io5';
import { FaPlane } from 'react-icons/fa';

const IconMarker = ({ size, label, icon, transform }) => (
  <div style={{
      width: (size) ? size : '1em',
      height: (size) ? size : '1em',
      transform: (transform) ? transform : 'translate(-50%, -50%)' }} >
    <OverlayTrigger placement='right'
        delay={{ show: 150, hide: 300 }}
        overlay={ <Tooltip>{label}</Tooltip> }>
      { icon }
    </OverlayTrigger>
  </div>
);

const LocationMarker = ({ size }) => (
  <IconMarker 
    label='Your Location'
    icon={ 
      <IoLocationSharp 
        className='text-primary' 
        size={size} /> }
    size={ size }
    transform='translate(-50%, -95%)' />
);

const PlaneMarker = ({ size, track }) => (
  <IconMarker 
    label='Nearest Plane'
    icon={
      <FaPlane
        className='text-primary'
        size={ size }
        style={{ transform: `rotate(${track-90}deg)` }} /> }
    size={ size }
    transform='translate(-50%, -50%)' />
);

const markerSize = "2.25em";
const buildMarkers = ( user, plane ) => (
  [
    ...(user ? [
      <LocationMarker key={0} 
        lat={ user.lat }
        lng={ user.lng }
        size={ markerSize } />
      ] : [] 
    ), 
    ...(plane ? [
      <PlaneMarker key={1}
        lat={ plane.latitude }
        lng={ plane.longitude}
        track={ plane.true_track }
        size={ markerSize } />
      ] : [] 
    )
  ]
);

const Map = ({ user, plane }) => {
  const [markers, setMarkers] = useState();

  useEffect(() => {
    setMarkers(buildMarkers(user, plane));
  }, [user, plane]);

  return (
    <GoogleMapReact 
        bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY}}
        center={{ lat: user.lat, lng: user.lng }}
        defaultZoom={10}
        style={{ height: "100%", width: "100%", position: 'relative' }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({map, maps}) => setMarkers(buildMarkers(user, plane))}>        
      { markers }
    </GoogleMapReact>
  );
}

export default Map;