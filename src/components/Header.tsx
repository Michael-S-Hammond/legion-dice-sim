import '../css/Header.css';

import React from 'react';

class Header extends React.Component<any> {
    constructor(props : any) {
        super(props);
    }

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark">
                <a className="navbar-brand" href="https://www.legionacademy.net/">
                    <img className="la-logo d-none d-sm-inline-block my-auto" alt="The Legion Academy Podcast"></img>
                </a>
                <h3 className="nav-header d-none d-sm-inline">The Legion Academy</h3>
                <h4 className="nav-header d-inline d-sm-none">The Legion Academy</h4>

                <button className="navbar-toggler black" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent15" aria-controls="navbarSupportedContent15"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent15">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="https://www.legionacademy.net/">Legion Academy - Home</a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="https://www.legionacademy.net/unit-analysis-and-mechanics">Legion Academy - Analysis</a>
                        </li>
                        <li className="nav-item active">
                            <a className="nav-link" href="https://www.legionacademy.net/terrain-studio">Terrain Studio</a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Header;
