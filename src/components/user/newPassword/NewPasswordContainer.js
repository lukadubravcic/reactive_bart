import React from 'react';
import NewPassword from './NewPassword';

const changePwdFormHeight = 579;
const animationDuration = 500;

class NewPasswordContainer extends React.Component {
    constructor(props) {
        super(props);

        this.hideTimeout = null;
        this.showTimeout = null;

        this.state = {
            showForm: false,
            containerStyle: {
                height: 0,
                background: '#FFA623',
            },
        };

        this.hidePwdForm = () => {
            requestAnimationFrame(() => {
                this.setState({
                    showForm: false,
                    containerStyle: {
                        ...this.state.containerStyle,
                        height: 0,
                    },
                });
            });
            this.props.hideForm();
        };

        this.showPwdForm = () => {
            requestAnimationFrame(() => {
                this.setState({
                    containerStyle: {
                        ...this.state.containerStyle,
                        height: changePwdFormHeight,
                    },
                });
            });

            this.showTimeout = setTimeout(() => {
                this.setState({
                    showForm: true,
                });
            }, animationDuration);
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.showForm === false && this.props.showForm === true) {
            // pokreni animaciju i pokazi formu
            this.showPwdForm();

        } else if (prevProps.showForm === true && this.props.showForm === false) {
            // pokreni animaciju i sakrij formu 
            this.hidePwdForm();
        }
    }

    render() {
        const showNewPasswordForm = this.state.showForm;

        return (
            <div
                className="height-tran"
                style={this.state.containerStyle}>
                {showNewPasswordForm
                    ? <div className="opacity-tran">
                        <NewPassword closeForm={this.hidePwdForm} />
                    </div>
                    : null
                }
            </div>
        )
    }

}


export default NewPasswordContainer;