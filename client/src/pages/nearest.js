import { useEffect, useState } from 'react';
import Loading from '../components/loading';
import Error from '../components/error';
import Map from '../components/map';
import PlaneInformation from '../components/plane-information';
import '../styles/nearest.css';

//const baseUrl = "http://localhost:8081/api"
const baseUrl = 'https://nearest-plane.herokuapp.com/api';

const geolocationSuccess = ( location, setLocation ) => {
  setLocation({
    lat: location.coords.latitude,
    lng: location.coords.longitude
  });
}

const geolocationFailure = ( error, setError ) => {
  console.log(error);
  if (error.code && error.code === 1) {
    setError({
      error: (
        <span>
          It seems we were denied access to your location.<br/>
          <span className='fw-light'>
            You'll need to provide us access to your location to conintue using Nearest Plane.
          </span>
        </span>
      ),
      retry: false
    });

  } else {
    setError({
      error: (
        <span>
          We encountered an unexpected error when retreiving your location.<br/>
          <span className='fw-light'>
            Trying again might fix the issue.
          </span>
        </span>
      ),
      retry: true
    })
  }  
}

const geolocationUnsupported = ( setError ) => {
  setError({
    error: (
      <span>
        Geolocation is not supported by this browser.<br/>
        Please update your browser settings or use a different browser in order to use Nearest Plane.
      </span>
    ),
    retry: false
  });
}

const requestGeoLocation = ( setLocation, setError ) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (location) => { geolocationSuccess(location, setLocation) },
      (error) => { geolocationFailure(error, setError) }
    )

  } else {
    geolocationUnsupported(setError);
  }
}

const getNearestPlane = ( location, setNearest, setError ) => {
  const fetchRetry = (location, n) => { 
    // console.log(`Try ${n}`);
    // Maximum of 3 retry attempts for single request
    if (n < 3) {
      fetch(`${baseUrl}/nearest?lat=${location.lat}&lon=${location.lng}`)
        .then(response => response.json())
        .then(data => {
          setNearest( data)
        })
        .catch(err => this.fetchRetry(location, n+1));

    } else {
      setError({
        error: (
          <span>
            We weren't able to retrieve the plane information from our servers.<br/>
            <span className="fw-light">Trying again might fix the issue.</span>
          </span>),
        retryError: true
      });
    }
  }

  fetchRetry(location, 0);
}

const Nearest = () => {
  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null
  });
  const [nearest, setNearest] = useState();
  const [error, setError] = useState({
    error: null,
    retry: false
  });

  useEffect(() => {
    requestGeoLocation(setUserLocation, setError);
  }, []);

  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      getNearestPlane( userLocation, setNearest, setError);
    }
  }, [userLocation]);


  if (error.error) return <Error error={error.error} retry={error.retry} />
  if (!nearest) return <Loading text="Locating nearest plane..."/>

  return (
    <div className="bg-light nearest-container">
      <div className="nearest-map">
        <Map 
          lat={userLocation.lat}
          lng={userLocation.lng}
          plane={nearest}/>
      </div>
      <PlaneInformation plane={nearest} />
    </div>
  )
}

export default Nearest;