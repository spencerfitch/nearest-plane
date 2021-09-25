import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import './styles/custom_bootstrap.css'
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Nearest from './pages/Nearest';
import NotFound from './pages/NotFound';

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
