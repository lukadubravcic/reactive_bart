import React from 'react';

const MAX_USERNAME_LEN = 20;

class SetUsername extends React.Component {

    constructor(props) {
        super(props);
        this.validationMessage = null;
        this.setUsername = ev => {
            ev.preventDefault();
            console.log(ev)
        };

        this.onUsernameChange = ev => {
            ev.preventDefault();
            
            if (ev.target.value.length < 1 || ev.target.value.length > 30) {
                console.log('ok')
                this.validationMessage = 'test'
            } else {
                this.validationMessage = null;
            }

        };
    }

    render() {
        return (
            <div className="container">
                <form>
                    <label>We're missing your name</label>
                    <br />
                    <input type="text" placeholder="Username" onChange={this.onUsernameChange} />
                    {this.validationMessage ? <label>{this.validationMessage}</label> : null}
                    <br />
                    <button onClick={this.setUsername}>Set username</button>
                </form>
            </div>
        )
    }
}

export default SetUsername;