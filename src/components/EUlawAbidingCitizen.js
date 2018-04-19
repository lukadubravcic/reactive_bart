import React from 'react';

class EULawAbidingCitizen extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="cookie-notice">
                <div className="cookie-notice-container">
                    <div className="cookie-content-left">
                        <span className="cookie-message">
                            We use cookies and local storage to provide you with better service. Carry on browsing if you're happy with this, or find out how to
                            &nbsp;<a href="https://negdje.nesto.com">manage cookies</a>.
                        </span>
                    </div>
                    <div className="cookie-content-right">
                        <button className="btn-cookie">
                            OK
                    </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default EULawAbidingCitizen;