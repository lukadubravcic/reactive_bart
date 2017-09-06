import React from 'react';

class Register extends React.Component {
    render() {
        return (
            <div className="auth-page">
                <div className="container page">
                    <div className="row">
                        <div className="col-md-6 offset-md-3 col-xs-12">
                            <h1 className="text-xs-center bottomMarginToTwenty">Register</h1>
                            <form>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="Username" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="email"
                                            placeholder="Email" />
                                    </fieldset>

                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="password"
                                            placeholder="Password" />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="password"
                                            placeholder="Repeat password" />
                                    </fieldset>
                                    <button
                                        className="btn btn-lg btn-primary pull-xs-right"
                                        type="submit">
                                        Register
                                    </button>

                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;