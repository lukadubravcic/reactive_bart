import React from 'react';

const animStyles = {
    parentContainerStyle: {
        height: 0 + "px",
    },
    textContainerStyle: {
        opacity: 0
    }
};

const animationDuration = 500;

class InformationFlasher extends React.Component {

    constructor(props) {
        super(props);
        this.parentContainerRef = null;

        this.dismountTimeout = null;
        this.dismountAnimationTimeout = null;

        this.state = {
            parentContainerStyle: {
                // height: 170 + "px",
                backgroundColor: "#f44242"
            },
            textContainerStyle: {
                paddingBottom: "50px",
                opacity: 1,
                transition: "opacity 0.25s"
            }
        };

        this.animateDismount = () => {
            requestAnimationFrame(() => {
                this.setState({
                    parentContainerStyle: { ...this.state.parentContainerStyle, ...animStyles.parentContainerStyle },
                    textContainerStyle: { ...this.state.textContainerStyle, ...animStyles.textContainerStyle }
                });
            });
            this.removeGuestMessage();
        };

        this.removeGuestMessage = () => {
            if (this.props.removeMsg !== null) {
                this.dismountTimeout = setTimeout(() => {
                    this.props.removeMsg();
                }, animationDuration);
            }
        }
    }

    componentDidMount() {
        this.setState({
            parentContainerStyle: {
                ...this.state.parentContainerStyle,
                height: this.parentContainerRef.clientHeight,
            }
        });
        this.dismountAnimationTimeout = setTimeout(this.animateDismount, this.props.displayTime);
        if (this.parentContainerRef) this.parentContainerRef.scrollIntoView({ behavior: "smooth" });
    }

    componentWillUnmount() {
        clearTimeout(this.dismountAnimationTimeout);
        clearTimeout(this.dismountTimeout);
    }

    render() {
        return (
            <div
                ref={elem => this.parentContainerRef = elem}
                style={this.state.parentContainerStyle}
                className="parent-component header height-tran">

                <div
                    className="container">

                    <label
                        style={this.state.textContainerStyle}
                        className="heading message-heading">
                        {this.props.message}
                    </label>
                </div>
            </div>
        )
    }
}

export default InformationFlasher;