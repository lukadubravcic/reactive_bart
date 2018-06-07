import React from 'react';

const COMPONENT_HEIGHT = 66;

class ShareAnonCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.componentContainerRef = null;
        this.setUsernameComponentRef = null;
        this.state = {
            containerStyle: {
                height: 0,
            },
            showNoUsernameMsg: false,
        }

        this.goToSetUsername = ev => {
            ev.preventDefault();
            if (this.setUsernameComponentRef === null) this.setUsernameComponentRef = document.getElementById("set-username-heading");
            if (this.setUsernameComponentRef) this.setUsernameComponentRef.scrollIntoView({ behavior: "smooth" });
        }
    }

    componentDidMount() {
        if (this.props.show) {
            this.setState({
                containerStyle: { ...this.state.containerStyle, height: COMPONENT_HEIGHT }
            });
        }
    }

    componentDidUpdate(prevProps) {
        if ((typeof this.props.currentUser.username === 'undefined'
            || this.props.currentUser.username === null)
            && this.state.showNoUsernameMsg === false) {
            this.setState({ showNoUsernameMsg: true });

        } else if (typeof this.props.currentUser.username !== 'undefined'
            && this.props.currentUser.username !== null
            && this.state.showNoUsernameMsg === true) {
            this.setState({ showNoUsernameMsg: false });
        }

        if (this.props.show === false && prevProps.show === true) {
            this.setState({
                containerStyle: { ...this.state.containerStyle, height: 0 },
            });
        } else if (this.props.show === true && prevProps.show === false) {
            this.setState({
                containerStyle: { ...this.state.containerStyle, height: COMPONENT_HEIGHT },
            });
        }
    }

    render() {
        if (!this.props.usrLoggedIn) return null;

        return (
            <div
                className="clear-fix height-tran"
                ref={elem => this.componentContainerRef = elem}
                style={this.state.containerStyle}>

                <label
                    className="float-left input-field-name opacity-tran"
                    style={{
                        display: this.props.show ? 'inline-block' : 'none',
                        paddingBottom: "18px",
                        opacity: this.props.show
                            ? this.state.showNoUsernameMsg
                                ? 0.5
                                : 1
                            : 0
                    }}>
                    ANONYMOUSLY
                </label>

                <label
                    style={{
                        opacity: this.props.show
                            ? this.state.showNoUsernameMsg
                                ? 0.5
                                : 1
                            : 0,
                        display: this.props.show ? 'inline-block' : 'none',
                    }}
                    className="float-left custom-chexbox-container opacity-tran">
                    <input
                        type="checkbox"
                        disabled={this.state.showNoUsernameMsg}
                        checked={this.props.value}
                        onChange={this.props.toggle} />

                    <span
                        style={{ cursor: this.state.showNoUsernameMsg ? "default" : "pointer" }}
                        id="checkmark">
                    </span>
                </label>
                {
                    this.state.showNoUsernameMsg
                        ? <label
                            style={{ opacity: 1 }}
                            id="form-submit-feedback"
                            className="float-left form-feedback">
                            SIGNED PUNISHMENTS REQUIRE USERNAME,<br /> WHY DON'T YOU&nbsp;
                        <a
                                className="cursor-pointer underline-on-hover"
                                onClick={this.goToSetUsername}>
                                CREATE ONE
                        </a>
                            ?
                    </label>
                        : null
                }
            </div >
        )
    }
}

export default ShareAnonCheckbox;