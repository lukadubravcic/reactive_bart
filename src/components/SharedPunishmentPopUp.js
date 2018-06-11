import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    sharedPunisment: this.game.sharedPunisment,
});

class SharedPunishmentPopUp extends React.Component {
    constructor(props) {
        super(props);

        this.hideDialog = ev => {
            ev && ev.preventDefault();
            this.props.shareDialogVisibilityHandler(false);
        }

        this.closeShareDialog = ev => {
            if (ev.target.id === "shared-popup-outside") // this.hideDialog();
            return;
        }
    }

    render() {
        return (
            <div
                id="shared-popup-outside"
                className="popup-component"
                onClick={this.closeShareDialog}>

                <div className="shared-popup-container">

                    <div className="shared-popup-header-container">
                        <label className="shared-popup-title">
                            Take it!
                        </label>
                        <span className="shared-popup-ordered-by">
                            ORDERED BY <span className="shared-popup-ordering-name">Pero Deformero</span>
                        </span>
                    </div>

                    <div className="shared-popup-content-container">
                        <span className="shared-popup-how-many-times">Write 100x</span>
                        <span className="shared-popup-pun-text">Lorem lorem, ipsum lorem.</span>
                        <span className="shared-popup-deadline-container">
                            DEADLINE <span className="shared-popup-deadline">23/05/2018</span>
                        </span>
                    </div>

                    <div className="shared-popup-footer-container">
                        <div className="shared-popup-btn-container">
                            <button className="shared-popup-btns">
                                CLAIM
                            </button>
                            <button className="shared-popup-btns">
                                TRY
                            </button>
                            <button className="shared-popup-btns">
                                IGNORE
                            </button>
                        </div>
                        <label className="shared-popup-pun-info">
                            300 claims and 120 tries so far.
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}


export default SharedPunishmentPopUp;