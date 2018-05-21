import React from 'react';
import { connect } from 'react-redux';


const animationDuration = 500;
const animStyles = {
    opacityDown: { opacity: 0 },
    heightUp: { height: 490 + 'px' }
};
const toRegAnimStyle = {
    opacityDown: { opacity: 0 },
    heightUp: { height: 669 + 'px' },
    registerColor: { backgroundColor: '#FFA623' },
}


class StartToolbar extends React.Component {

    constructor(props) {
        super(props);
        this.loginTimeout = null;
        this.registerTimeout = null;
        this.componentDiv = null;

        this.state = {
            componentStyle: {},
            buttonStyle: { opacity: 1 }
        }

        this.clickHandler = ev => {
            ev.preventDefault();
            this.triggerAnimation();
            this.showLogin();
        }

        this.showLogin = () => {
            this.loginTimeout = setTimeout(() => {
                this.props.btnClickCallback();
            }, animationDuration);
        }

        this.showRegisterForm = ev => {
            ev.preventDefault();
            this.triggerToRegisterAnimation();
            this.registerTimeout = setTimeout(() => {
                this.props.showRegisterForm();
            }, animationDuration);
        }

        this.triggerAnimation = () => {
            requestAnimationFrame(() => {
                this.setState({
                    componentStyle: { ...this.state.componentStyle, ...animStyles.heightUp },
                    buttonStyle: { ...this.state.buttonStyle, ...animStyles.opacityDown }
                });
            });
        }

        this.triggerToRegisterAnimation = () => {
            requestAnimationFrame(() => {
                this.setState({
                    componentStyle: { ...this.state.componentStyle, ...toRegAnimStyle.heightUp, ...toRegAnimStyle.registerColor },
                    buttonStyle: { ...this.state.buttonStyle, ...toRegAnimStyle.opacityDown }
                });
            });
        }
    }

    componentDidMount() {
        this.setState({
            componentStyle: { ...this.state.componentStyle, height: this.componentDiv.clientHeight }
        });
    }

    componentWillUnmount() {
        clearTimeout(this.loginTimeout);
        clearTimeout(this.registerTimeout);
    }

    render() {
        return (
            <div
                style={this.state.componentStyle}
                ref={elem => this.componentDiv = elem}
                className="parent-component header height-bcg-color-tran">

                <div className="container">
                    <button
                        style={this.state.buttonStyle}
                        id="btn-log-in"
                        className="btn-submit opacity-tran"
                        onClick={this.clickHandler}
                        disabled={this.props.disabled}>

                        LOG IN
                    </button>
                    <a
                        style={this.state.buttonStyle}
                        id="register-link"
                        onClick={this.showRegisterForm}
                        disabled={this.props.disabled}>
                        REGISTER
                    </a>
                    <div style={{ clear: "both" }}></div>
                </div>
            </div>
        );
    }

}

export default StartToolbar;