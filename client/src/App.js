import React from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';

import Navigation from './Navigation';
import Home from './BodyPages/Home';
import About from './BodyPages/About';
import Nearest from './BodyPages/Nearest';
import NotFound from './BodyPages/NotFound';

const App = () => (
  <Router hashType="slash">
    <div className="vh-100 d-flex flex-column bg-light">
      <Navigation />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/nearest">
          <Nearest />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </div>
  </Router>    
);

export default App;
