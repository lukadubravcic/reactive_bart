import React from 'react';
import { connect } from 'react-redux';
import Login from './components/login/Login';
import Register from './components/register/Register';

const mapStateToProps = state => ({
  appName: state.appName
});

class App extends React.Component {
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
        <div>TODO</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, () => ({}))(App);
