import React from 'react';
import { connect } from 'react-redux';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Game from './components/game/Game';
import agent from './agent';


const mapStateToProps = state => ({
    appName: state.common.appName
});

const mapDispatchToProps = dispatch => ({
    onLoad: (token) => {
        if (token) {
            agent.setToken(token);
            agent.Auth.current().then((payload) => {
                if (payload !== null) {
                    console.log(payload.name);
                    dispatch({ type: 'APP_LOAD', token, user: { username: payload.name, email: payload.email } })
                }
            });
        }
    }
});

class App extends React.Component {

    componentWillMount() {
        const token = window.localStorage.getItem('token');
        if (token) {
            this.props.onLoad(token);
        }

    }

    render() {
        return (
            <div>
                <nav className="navbar">
                    <div className="container">
                        <h1 className="navbar-brand">{this.props.appName}</h1>
                    </div>
                </nav>
                <Login />
                <hr />
                <Register />
                <Game />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
