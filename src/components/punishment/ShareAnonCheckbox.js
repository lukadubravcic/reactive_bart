import React from 'react';


class ShareAnonCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.componentContainerRef = null;
        this.state = {
            componentHeight: null,
            currentHeight: null,
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
        if (
            this.state.componentHeight === null
            && this.componentContainerRef !== null
            && this.componentContainerRef.clientHeight !== 0
        ) {
            // spremi u state trenutnu visinu komponente
        }

        if (this.props.show === false && prevProps.show === true) {
            this.setState({
                componentHeight: this.componentContainerRef.clientHeight,
                currentHeight: 0,
            });
        } else if (this.props.show === true && prevProps.show === false) {
            this.setState
        }
    }


    render() {
        if (!this.props.usrLoggedIn) return null;

        return (
            <div
                ref={elem => this.componentContainerRef = elem}
                className="clear-fix height-tran">

                <label
                    className="float-left input-field-name"
                    style={{ paddingBottom: "18px" }} >
                    ANONYMOUSLY
                </label>

                <label className="float-left custom-chexbox-container">
                    <input
                        type="checkbox"
                        checked={this.props.value}
                        onChange={this.props.toggle}
                    />
                    <span id="checkmark"></span>
                </label>
            </div>
        )
    }
}

export default ShareAnonCheckbox;