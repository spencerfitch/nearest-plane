import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Navigation from './Navigation';
import Home from './BodyPages/Home';
import About from './BodyPages/About';
import Nearest from './BodyPages/Nearest';

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
                <div>
                    <Navigation />
                    
                    <Switch>
                        <Route path="/nearest">
                            <Nearest />
                        </Route>
                        <Route path="/about">
                            <About />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>

                        
                    </Switch>
                </div>
            </Router>
            
        )
    }
    
}



export default App;
