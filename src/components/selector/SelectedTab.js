import React from 'react';
import { connect } from 'react-redux';


const mapStateToProps = state => ({ acceptedPunishments: state.punishment.acceptedPunishments });

const mapDispatchToProps = dispatch => ({
    
});

class SelectedTab extends React.Component {

    constructor() {
        super();
    }

    render() {

        const acceptedPunishments = this.props.punishment.punishments;
        const style = {
            paddingLeft: "5px",
            paddingRighr: "5px"
        }

        if (acceptedPunishments.length > 0) return (
            <div className="container">
                {
                    this.props.acceptedPunishments.map(punishment => {
                        return (
                            <label style={style}>{punishment.what_to_write}</label>
                        )
                    })
                }
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedTab);