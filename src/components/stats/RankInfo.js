import React from 'react';


class RankInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <h2>Your rank <b>#{this.props.rank}</b></h2>
                <p>Based on bla, bla, bla...</p>
            </div>
        )
    }
}


export default RankInfo;