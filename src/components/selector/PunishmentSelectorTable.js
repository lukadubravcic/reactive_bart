import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

import SelectedTab from './SelectedTab'

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onLoadedPunishments: (punishments) => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_LOADED', punishments })
    }
});

class PunishmentSelectorTable extends React.Component {

    constructor() {
        super();
    }

    componentWillMount() {
        // dohvat punishmenta
        agent.Punishment.getAccepted().then((payload) => {
            this.props.onLoadedPunishments(payload.punishments);
        });
    }

    render() {

        const punishments = this.props.punishment.punishments;
        let viewTab = null;

        if (this.props.punishment.selectedTab === 'accepted') {
            return (
                <div className="container">
                    <SelectedTab />
                </div>
            );
        }

        else if (this.props.punishment.selectedTab === 'past') { }
        else if (this.props.punishment.selectedTab === 'ordered') { }
        else {
            return (
                <h1 className="container">NO DATA</h1>
            )

        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentSelectorTable)