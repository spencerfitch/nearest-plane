import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Navigation from './Navigation';
import Home from './BodyPages/Home';
import About from './BodyPages/About';
import Nearest from './BodyPages/Nearest';
import NotFound from './BodyPages/NotFound';

class App extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            "lat": null,
            "lon": null,
            "nearest": null
        }
    }

    render () {
        return (
            <Router>
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
            
        )
    }
    
}



export default App;
