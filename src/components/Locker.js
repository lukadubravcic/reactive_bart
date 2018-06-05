import React from 'react';
import { connect } from 'react-redux';


const mapStateToProps = state => ({
    currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
    showLoginForm: () => dispatch({ type: 'SHOW_LOGIN_FORM' }),
});


class Locker extends React.Component {
    constructor(props) {
        super(props);
        this.topElement = null;
        this.showLoginFormTimeout = null;

        this.state = {
            loginHovering: false,
        }

        this.onLoginHover = ev => {
            this.setState({ loginHovering: true });
        }

        this.onLoginHoverOut = ev => {
            this.setState({ loginHovering: false });
        }

        this.goToLoginForm = ev => {
            ev.preventDefault();
            this.props.showLoginForm();
            if (this.topElement) this.topElement.scrollIntoView({ behavior: "smooth" });
        }
    }

    componentDidMount() {
        this.topElement = document.getElementById("top");
    }

    render() {
        const userLoggedIn = typeof this.props.currentUser !== 'undefined'
            && this.props.currentUser !== null
            && Object.keys(this.props.currentUser).length;

        if (userLoggedIn) return null;
        else {
            return (
                <div className="locker-component-container parent-component">
                    <div className="container locker-content-container">
                        <div className="padlock-container">
                            {this.state.loginHovering ? openPadlockSVG : closedPadlockSVG}
                        </div>

                        <div className="locker-msg-container">
                            <a
                                className="login-link"
                                onClick={this.goToLoginForm}
                                onMouseOver={this.onLoginHover}
                                onMouseOut={this.onLoginHoverOut}>
                                Log in</a>
                            &nbsp;to unlock full Skolded power
                            and climb the Skoldboard!
                    </div>
                    </div>
                </div>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Locker);


const closedPadlockSVG = (

    <svg id="closed-padlock" width="67px" height="88px" viewBox="0 0 67 88" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Zakljucani-lokot" transform="translate(0.000000, -1.000000)" fill="#A479E1">
                <path d="M54.2096,33.8388559 L46.6540444,33.8388559 L46.6540444,22.0802966 C46.6540444,14.7913475 40.7123556,8.86002542 33.4106667,8.86002542 C26.1089778,8.86002542 20.1672889,14.7913475 20.1672889,22.0802966 L20.1672889,33.8388559 L12.6117333,33.8388559 L12.6117333,22.0802966 C12.6117333,10.6324831 21.9428444,1.31765254 33.4106667,1.31765254 C44.8784889,1.31765254 54.2096,10.6324831 54.2096,22.0802966 L54.2096,33.8388559 Z" id="Fill-4"></path>
                <path d="M66.8219378,80.4480051 L66.8219378,39.3978864 C66.8219378,39.3978864 66.8219378,30.8463441 58.2554489,30.8463441 L8.56709333,30.8463441 C8.56709333,30.8463441 0.000604444444,30.8463441 0.000604444444,39.3978864 L0.000604444444,80.4480051 C0.000604444444,80.4480051 0.000604444444,88.9995475 8.56709333,88.9995475 L58.2554489,88.9995475 C58.2554489,88.9995475 66.8219378,88.9995475 66.8219378,80.4480051 M40.79456,59.9237 C40.79456,63.9935644 37.4882489,67.2925983 33.4112711,67.2925983 C29.3327822,67.2925983 26.0279822,63.9935644 26.0279822,59.9237 C26.0279822,55.8523271 29.3327822,52.5532932 33.4112711,52.5532932 C37.4882489,52.5532932 40.79456,55.8523271 40.79456,59.9237" id="Fill-1"></path>
            </g>
        </g>
    </svg>
);

const openPadlockSVG = (

    <svg id="open-padlock" width="67px" height="94px" viewBox="0 0 67 94" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Otkljucani-lokot" transform="translate(0.000000, -10.000000)" fill="#A479E1">
                <path d="M66.8219378,95.45244 L66.8219378,54.4236092 C66.8219378,54.4236092 66.8219378,45.8765015 58.2554489,45.8765015 L8.56709333,45.8765015 C8.56709333,45.8765015 0.000604444444,45.8765015 0.000604444444,54.4236092 L0.000604444444,95.45244 C0.000604444444,95.45244 0.000604444444,103.999548 8.56709333,103.999548 L58.2554489,103.999548 C58.2554489,103.999548 66.8219378,103.999548 66.8219378,95.45244 M40.79456,74.9387785 C40.79456,79.0065323 37.4882489,82.3038554 33.4112711,82.3038554 C29.3327822,82.3038554 26.0279822,79.0065323 26.0279822,74.9387785 C26.0279822,70.8695169 29.3327822,67.5721938 33.4112711,67.5721938 C37.4882489,67.5721938 40.79456,70.8695169 40.79456,74.9387785" id="Fill-1"></path>
                <path d="M48.8130114,41.4316931 L41.5346607,41.4316931 L41.5346607,29.6792316 C41.5346607,22.3940624 35.8109657,16.4658162 28.7771675,16.4658162 C21.7433694,16.4658162 16.0196744,22.3940624 16.0196744,29.6792316 L16.0196744,41.4316931 L8.7413237,41.4316931 L8.7413237,29.6792316 C8.7413237,18.2373547 17.7300868,8.92735468 28.7771675,8.92735468 C39.8242483,8.92735468 48.8130114,18.2373547 48.8130114,29.6792316 L48.8130114,41.4316931 Z" id="Fill-4" transform="translate(32.877333, 25.179524) rotate(-30.000000) translate(-32.877333, -25.179524) "></path>
            </g>
        </g>
    </svg>
);