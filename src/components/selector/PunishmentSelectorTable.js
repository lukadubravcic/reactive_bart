import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({

})


class PunishmentSelectorTable extends React.Component {
    constructor() {
        super()
    }

    onComponentMount() {

    }

    render() {
        return (
            <div className="container">
                <h2>Table</h2>
                {!this.props.articles}

            </div>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentSelectorTable)