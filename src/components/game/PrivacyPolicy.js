import React from 'react';

const PrivacyPolicy = props => {

    return (
        <div
            id="board-textarea"
            className="noselect"
        >
            <span
                style={{
                    display: "inline-block",
                    width: 100 + "%",
                    textAlign: "center",
                    fontSize: "45px",
                }}>
                Privacy policy
            </span>
            <br /><br />
            <span
                style={{
                    display: "block",
                    fontSize: "20px",
                    lineHeight: "32px",
                }}>
                {textPrivacyPolicy}
            </span>
        </div>
    )
}

export default PrivacyPolicy;


const textPrivacyPolicy = `What happens on Skolded.com, stays on Skolded.com.`;


