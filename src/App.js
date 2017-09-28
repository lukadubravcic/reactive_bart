import React from 'react';
import { connect } from 'react-redux';

import Login from './components/login/Login';
import Register from './components/register/Register';
import Game from './components/game/Game';
import PunishmentCreator from './components/punishment/PunishmentCreator';
import PunishmentSelectorTable from './components/selector/PunishmentSelectorTable';

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
                    dispatch({
                        type: 'APP_LOAD',
                        token,
                        user: {
                            _id: payload._id,
                            email: payload.email,
                            username: payload.username
                        }
                    });
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
                <Register />
                <hr />
                {/* <Game />
                <hr />  */}
                <PunishmentCreator />
                <hr />
                <PunishmentSelectorTable />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
