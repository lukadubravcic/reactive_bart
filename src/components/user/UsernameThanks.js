import React from 'react';

const mountStyles = {
    parentContainerStyle: {
        height: 270 + 'px'
    },
    textContainerStyle: {
        opacity: 1
    }
};

const dismountStyles = {
    parentContainerStyle: {
        transition: 'height 0.2s 0.3s',
        height: 0 + 'px'
    },
    textContainerStyle: {
        transition: 'height 0.3s',
        opacity: 0
    }
}

const displayDuration = 5000; // 5s 
const animationDuration = 500;


class UsernameThanks extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            parentContainerStyle: {
                height: 399 + 'px'
            },
            textContainerStyle: {
                opacity: 0
            }
        }

        this.animateDismountTimeout = null;
        this.componentDismountTimeout = null;

        this.dismountComponent = () => {
            this.componentDismountTimeout = setTimeout(() => {
                this.props.unmountCallback('loggedIn');
            }, animationDuration)
        }

        this.animateMounting = () => {
            this.setState({
                parentContainerStyle: { ...this.state.parentContainerStyle, ...mountStyles.parentContainerStyle },
                textContainerStyle: { ...this.state.textContainerStyle, ...mountStyles.textContainerStyle }
            });
        }

        this.animateDismounting = () => {
            this.animateDismountTimeout = setTimeout(() => {
                requestAnimationFrame(() => {
                    this.setState({
                        parentContainerStyle: { ...this.state.parentContainerStyle, ...dismountStyles.parentContainerStyle },
                        textContainerStyle: { ...this.state.textContainerStyle, ...dismountStyles.textContainerStyle }
                    });
                });
                this.dismountComponent();
            }, displayDuration);
        }
    }

    componentDidMount() {
        requestAnimationFrame(() => {
            this.animateMounting();
        });
        this.animateDismounting();
    }

    componentWillUnmount() {
        clearTimeout(this.componentDismountTimeout);
        clearTimeout(this.animateDismountTimeout);
    }

    render() {
        return (
            <div
                style={this.state.parentContainerStyle}
                className="parent-component header height-tran-fast">

                <div
                    style={this.state.textContainerStyle}
                    className="container opacity-03-delay-tran-fast">

                    <label className="heading message-heading">
                        Thanks! Let me punish you in return.<br />
                        It's optional. Really.
                    </label>
                </div>
            </div>
        )
    }

}

export default UsernameThanks;
