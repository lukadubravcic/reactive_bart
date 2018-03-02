import React from 'react';
import { connect } from 'react-redux';


const animationDuration = 500;
const animStyles = {
    opacityDown: { opacity: 0 },
    heightUp: { height: 490 + 'px' }
};


class StartToolbar extends React.Component {

    constructor(props) {
        super(props);

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
            setTimeout(() => {
                this.props.btnClickCallback();
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
    }

    componentDidMount() {
        this.setState({
            componentStyle: { ...this.state.componentStyle, height: this.componentDiv.clientHeight }
        });
    }

    render() {
        return (
            <div
                style={this.state.componentStyle}
                ref={elem => this.componentDiv = elem}
                className="parent-component header height-tran">

                <div className="container">
                    <button
                        style={this.state.buttonStyle}
                        id="btn-log-in"
                        className="btn-submit opacity-tran"
                        onClick={this.clickHandler}>

                        LOG IN
                        </button>
                </div>
            </div>
        );
    }

}

export default StartToolbar;