import { useEffect } from 'react';
import { FaPlane } from 'react-icons/fa';
import '../styles/plane-animation.css';

/**
 * Generate animation coordinates based on specified walls
 * @param {Object} initWall Wall (l,r,t,b) plane will enter the screen from
 * @param {String} destWall Wall (l,r,t,b) plane will exit the screen through 
 * @returns {Object} Coordinates object of form {'init': [left, top], 'dest': [left, top]}
 */
const genPlanePath = (initWall, destWall) => {
  const wallVals = {
    l: 0,
    r: 1,
    t: 2,
    b: 3
  };

  if (!(initWall in wallVals) || !(destWall in wallVals)) {
    // Invalid wall provided
    throw new Error(`initWall and destWall must be one of [${Object.keys(wallVals).join(', ')}]. Given '${initWall}' and '${destWall}'`);
  };
  if (initWall === destWall) {
    // Identical walls provided
    console.warn(`genPlanePath: Generating a path between the same wall '${initWall}'`);
  };

  const walls = {
    'init': wallVals[initWall],
    'dest': wallVals[destWall]
  }
  const coords = {
    'init': [0,0],
    'dest': [1,1]
  }
  // Coordinate padding to prevent small corner flights
  const padding = {
    'init': 0,
    'dest': 30
  }
  // Populate coordinates
  for (let c in coords) {
    if (walls[c] < 2) {
      // Left or Right wall
      coords[c][0] = (walls[c]%2) ? 110 : 0;
      coords[c][1] = padding[c] + Math.floor(Math.random() * (100-padding[c]));
    } else {
      // Top or Bottom wall
      coords[c][0] = padding[c] + Math.floor(Math.random() * (100-padding[c]));
      coords[c][1] = (walls[c]%2) ? 110 : 0;
    }
  }

  return coords;  
}

/**
 * Generate animation for a particular plane
 * @param {Object} plane DOM plane element to animate
 */
const animatePlane = (plane) => {
  const walls = ['l', 'r', 't', 'b']

  // Determine initial and destination walls
  const initWallIdx = Math.floor(Math.random() * 4);
  const destWallIdx = (initWallIdx + 1+Math.floor(Math.random() * 3)) % 4;
  
  // Determine path coordinates
  const coords = genPlanePath(walls[initWallIdx], walls[destWallIdx]);

  // Determine path rotation angle
  const deltaX = (coords.dest[0] - coords.init[0]) * window.innerWidth;
  const deltaY = (coords.dest[1] - coords.init[1]) * window.innerHeight;
  
  let rotation = Math.floor(Math.atan(deltaY/deltaX) * 180/Math.PI);
  if (deltaX < 0) rotation += 180;

  // Create animation
  const formatCoord = (coord) => `${coord[0]}vw, ${coord[1]}vh`
  const animation = plane.animate([
      {transform: `translate(${formatCoord(coords.init)}) rotate(${rotation}deg)`},
      {transform: `translate(${formatCoord(coords.dest)}) rotate(${rotation}deg)`}
  ], {
      duration: 5000,
      iterations: 1,
      composite: 'replace'
  });

  // Recursively reanimate plane each iteration.
  // Enables random generation of pane paths.
  animation.onfinish = () => animatePlane(plane);
}

const PlaneAnimation = ({ count }) => {
  useEffect(() => {
    document.querySelectorAll('.plane').forEach((plane, idx) => {
      setTimeout(() => {
        animatePlane(plane);
      }, idx*500);
    });
  }, [])

  return (
    <ul className="plane-container">
      {[...Array(count ? count : 10).keys()].map(i => (
        <FaPlane  key={i} className="plane" />
      ))}
    </ul>
  );
};

export default PlaneAnimation;
