import React from 'react';

class EULawAbidingCitizen extends React.Component {
    constructor() {
        super();
        this.state = {
            showElement: true,
        };

        this.handleAgreeClick = () => {
            localStorage.setItem('cookie_agreed', "true");
            this.setState({ showElement: false });
        }
    }

    componentDidMount() {
        if (localStorage.getItem('cookie_agreed') === "true") {
            this.setState({ showElement: false });
        }
    }

    render() {
        if (this.state.showElement) {
            return (
                <div className="cookie-notice">
                    <div className="container cookie-notice-container">
                        <div className="cookie-content-left">
                            <span className="cookie-message">
                                Skolded.com uses cookies and local storage to provide you with a better service.
                                By continuing to browse Skolded.com you are agreeing to our use of cookies and local storage.
                                Cookie jar is not considered local storage, but stealing cookies from the jar is strictly prohibited,
                                will not be tolerated and you will be punished for doing it.
                            </span>
                        </div>
                        <div className="cookie-content-right">
                            <div className="cookie-btn-container">
                                <button
                                    className="btn-cookie"
                                    onClick={this.handleAgreeClick}>
                                    AGREE
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return null;
        }
    }
}

export default EULawAbidingCitizen;