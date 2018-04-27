import React from 'react';

const TermsOfService = props => {

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
                Terms of Service
            </span>
            <br /><br />
            <span
                style={{
                    display: "block",
                    fontSize: "20px",
                    lineHeight: "32px",
                }}>
                {textTermsOfService}
            </span>
        </div>
    )
}

export default TermsOfService;


const textTermsOfService = `Skolded is provided "as is". Don't make it complicated. Also, don't do any harm. Enjoy life.`;