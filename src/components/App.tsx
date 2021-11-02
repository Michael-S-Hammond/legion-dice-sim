import '../css/App.css';

import React from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import Header from './Header';
// import Notification from './Notification';
import ResultsComparison from './ResultsComparison';
import Simulator from './Simulator';

function App(): JSX.Element {
    return (
        <Router>
            <main role="main">
                <Header></Header>
                {/* <Notification message='Rerolls received a substantial update. More coming soon.'></Notification> */}

                <Switch>
                    <Route path='/compare'>
                        <ResultsComparison/>
                    </Route>
                    <Route path='/'>
                        <Simulator/>
                    </Route>
                </Switch>
            </main>
        </Router>
    );
}

export default App;
