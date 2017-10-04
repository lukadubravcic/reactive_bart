import React from 'react';
import { connect } from 'react-redux';

import AcceptedTab from './AcceptedTab'

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({

});

class PunishmentSelectorTable extends React.Component {

    constructor() {
        super();
    }

    render() {

        //const acceptedPunishments = this.props.punishment.acceptedPunishments;
        let viewTab = null;

        const style = {
            display: "inline-block",
            fontWeight: "bold"
        }
        const selectedStyle = {
            ...style, 
            textDecoration: "underline"
        }

        let tableTabNamesElement =
            <div style={{"margin": "auto", "width":"60%"}} >
                <label style={selectedStyle} onClick={()=>{console.log('click')}}>ACCEPTED</label>
                <label style={style}>PAST</label>
                <label style={style}>ORDERED</label>
            </div>;



        if (this.props.common.currentUser._id) { // user logged in?
            if (this.props.punishment.selectedTab === 'accepted') {
                
                return (
                    <div className="container">
                        {tableTabNamesElement}
                        <AcceptedTab />
                    </div>
                );
            }
            else if (this.props.punishment.selectedTab === 'past') { }
            else if (this.props.punishment.selectedTab === 'ordered') { }
        }
        else { // user not logged in
            return null;
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentSelectorTable)