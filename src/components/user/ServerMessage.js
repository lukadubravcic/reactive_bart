import React from 'react';

const animStyles = {
    parentContainerStyle: {
        height: 170 + "px",
    }
};

class ServerMessage extends React.Component {

    constructor(props) {
        super(props);

        this.parentContainerRef = null;

        this.state = {
            parentContainerStyle: {
                /* height: 0 + "px", */
                backgroundColor: "#00BBD6"
            }
        }

        this.animateMounting = () => {
            this.setState({
                parentContainerStyle: { ...this.state.parentContainerStyle, ...animStyles.parentContainerStyle }
            });
        }
    }

    componentDidMount() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.animateMounting();
            });
        });
    }

    render() {

        return (
            <div
                ref={elem => this.parentContainerRef = elem}
                style={this.state.parentContainerStyle}
                className="parent-component header height-tran">

                <div className="container">
                    <label
                        style={{ paddingBottom: "50px" }}
                        className="heading message-heading">
                        {this.props.message}
                    </label>
                </div>
            </div>
        )
    }
}

export default ServerMessage;