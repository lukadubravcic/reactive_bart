import React from 'react';
// import { connect } from 'react-redux';

// const mapStateToProps = state => ({

// });

class SharePunishmentDialog extends React.Component {
    constructor(props) {
        super(props);

        this.stringToShare = `text to share`;

        this.changeBtnStringTimeout = null;

        this.state = {
            copyBtnString: 'COPY',
        }

        this.hideDialog = ev => {
            ev && ev.preventDefault();
            this.props.shareDialogVisibilityHandler(false);
        }

        this.closeShareDialog = ev => {
            if (ev.target.id === "share-dialog-outside") this.hideDialog();
            return;
        }

        this.copyClick = ev => {
            ev.preventDefault();
            if (
                typeof this.props.data !== 'undefined'
                && this.props.data !== null
                && typeof this.props.data.shareLink !== 'undefined'
                && this.props.data.shareLink !== null
            ) {
                copyTextToClipboard(this.props.data.shareLink);
            }
            this.animateCopyClick();
        }

        this.animateCopyClick = ev => {
            this.setState({ copyBtnString: 'COPIED' });
            this.changeBtnStringTimeout = setTimeout(() => {
                this.setState({ copyBtnString: 'COPY' });
            }, 1000);
        }

        this.twitterShare = () => {
            let width = 600,
                height = 500,
                left = 200,
                top = 200,
                url = 'http://twitter.com/share',
                opts = 'status=1' +
                    ',width=' + width +
                    ',height=' + height +
                    ',top=' + ((window.screen.availHeight - height) / 2) +
                    ',left=' + ((window.screen.availWidth - width) / 2);

            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.stringToShare + " #Skolded")}`, 'targetWindow', opts);
        }

        this.fbShare = () => {
            window.FB.ui({
                method: 'share',
                href: 'https://www.skolded.com',
                quote: this.stringToShare,
                hashtag: '#skolded',
            }, function (response) { });
        }

        this.mailShare = () => {

        }

        this.getPunishmentInfoElement = () => {
            if (typeof this.props.data.punishment === 'undefined') return null;

            const claims = this.props.data.punishment.shared_claims || 0;
            let tries = this.props.data.punishment.shared_tries || 0;

            return (
                <div
                    style={{ textAlign: "center" }}
                    className="shared-popup-pun-info-container">

                    <label
                        style={{ color: "white" }}
                        className="shared-popup-pun-info">
                        {claims} claims and {tries} tries so far.
                    </label>
                </div>
            )
        }
    }

    componentWillUnmount() {
        clearTimeout(this.changeBtnStringTimeout);
    }

    render() {
        const shareLink = typeof this.props.data !== 'undefined'
            && this.props.data !== null
            && typeof this.props.data.shareLink !== 'undefined'
            && this.props.data.shareLink !== null
            ? this.props.data.shareLink : 'Sorry, try again.';
        const anon = typeof this.props.data !== 'undefined'
            && this.props.data !== null
            && typeof this.props.data.anon !== 'undefined'
            ? this.props.data.anon : true;
        const mailSubject = encodeURIComponent('Skolded punishment');
        const mailBody = encodeURIComponent('Here you go: ' + shareLink);
        const punishmentInfoElement = this.getPunishmentInfoElement();

        return (
            <div
                id="share-dialog-outside"
                className="popup-component"
                onClick={this.closeShareDialog}>

                <div className="share-pun-dialog-container">
                    <div className="share-dialog-title-container">
                        <label className="share-dialog-title">
                            Share it!
                    </label>
                        <button
                            className="btn-close-share-dialog"
                            onClick={this.hideDialog}>
                            {closeBtnSVG}
                        </button>
                    </div>
                    <div className="share-dialog-social-container">
                        <button
                            id="twitter-btn-share-pun"
                            className="share-dialog-icon-btns"
                            onClick={this.twitterShare}>
                            {twitterSVG}
                        </button>
                        <button
                            id="facebook-btn-share-pun"
                            className="share-dialog-icon-btns"
                            onClick={this.fbShare}>
                            {fbSVG}
                        </button>
                        <a
                            id="mail-btn-share-pun"
                            className="share-dialog-icon-btns"
                            href={`mailto:?subject=${mailSubject}&body=${mailBody}`}
                            onClick={this.mailShare}>
                            {shareViaMailSVG}
                        </a>
                    </div>
                    <div className="share-dialog-link-container">
                        <label className="share-dialog-link-label">
                            LINK
                    </label>
                        <input
                            className="text-input share-dialog-link-input"
                            type="text"
                            value={shareLink}
                            readOnly>
                        </input>
                        <button
                            className="btn-submit share-dialog-copy-btn"
                            onClick={this.copyClick}>
                            {this.state.copyBtnString}
                        </button>
                    </div>
                    {anon
                        ? null
                        : <div className="share-dialog-bottom-msg-container">
                            <label className="share-dialog-bottom-msg">Share link is permanently available in ORDERED tab.</label>
                        </div>
                    }
                    {punishmentInfoElement}
                </div>
            </div>
        )
    }
}


export default SharePunishmentDialog;


const closeBtnSVG = (
    <svg width="20px" height="19px" viewBox="0 0 20 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Welcome" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
            <g id="share-btn-svg" transform="translate(-541.000000, -20.000000)" stroke="#FFFFFF">
                <g id="Line-+-Line-Copy" transform="translate(541.000000, 20.000000)">
                    <path d="M0.526315789,0.526315789 L18.9548854,18.9548854" id="Line"></path>
                    <path d="M0.526315789,0.526315789 L18.9548854,18.9548854" id="Line-Copy" transform="translate(10.000000, 10.000000) scale(-1, 1) translate(-10.000000, -10.000000) "></path>
                </g>
            </g>
        </g>
    </svg>
);

const twitterSVG = (
    <svg id="twitter-share-dialog-icon" className="share-dialog-icon" width="47px" height="38px" viewBox="0 0 32 26" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="page-02a" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-1146.000000, -2762.000000)">
            <g id="twitter-g" transform="translate(0.000000, 2520.000000)" fill="#FFFFFF">
                <path d="M1156.08426,268 C1168.11922,268 1174.70017,258.029565 1174.70017,249.384087 C1174.70017,249.100783 1174.6947,248.818261 1174.68217,248.538087 C1175.95939,247.614609 1177.06991,246.461826 1177.94565,245.149391 C1176.7733,245.671391 1175.51174,246.022 1174.18835,246.180087 C1175.53913,245.369304 1176.57609,244.088174 1177.06522,242.561304 C1175.8013,243.310261 1174.40122,243.854957 1172.91035,244.149217 C1171.71687,242.877478 1170.01704,242.082348 1168.13487,242.082348 C1164.52157,242.082348 1161.59148,245.012435 1161.59148,248.624174 C1161.59148,249.137565 1161.64861,249.63687 1161.76052,250.115826 C1156.32296,249.842696 1151.50052,247.238957 1148.27383,243.279739 C1147.71191,244.246261 1147.38791,245.369304 1147.38791,246.569043 C1147.38791,248.838609 1148.54383,250.842087 1150.3,252.015217 C1149.22626,251.981565 1148.21826,251.686522 1147.33626,251.196609 C1147.33548,251.224 1147.33548,251.250609 1147.33548,251.280348 C1147.33548,254.448348 1149.59096,257.094348 1152.58443,257.693826 C1152.03504,257.844087 1151.45591,257.924696 1150.85957,257.924696 C1150.43852,257.924696 1150.02765,257.882435 1149.6293,257.805739 C1150.46278,260.405565 1152.87791,262.297913 1155.74148,262.350348 C1153.50243,264.105739 1150.68113,265.151304 1147.61565,265.151304 C1147.08739,265.151304 1146.56696,265.121565 1146.05435,265.060522 C1148.95,266.91687 1152.38878,268 1156.08426,268"
                    id="Fill-68"></path>
            </g>
        </g>
    </svg>
);

const fbSVG = (
    <svg id="facebook-share-dialog-icon" className="share-dialog-icon" width="40px" height="40px" viewBox="0 0 27 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="page-02a" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-1203.000000, -2761.000000)">
            <g id="facebook-g" transform="translate(0.000000, 2520.000000)" fill="#FFFFFF">
                <path d="M1230,245.472609 C1230,243.127913 1227.8807,241.007043 1225.536,241.007043 L1207.67687,241.007043 C1205.33061,241.007043 1203.2113,243.127913 1203.2113,245.472609 L1203.2113,263.332522 C1203.2113,265.678783 1205.33061,267.795739 1207.67687,267.795739 L1216.60565,267.795739 L1216.60565,257.678174 L1213.332,257.678174 L1213.332,253.212609 L1216.60565,253.212609 L1216.60565,251.471304 C1216.60565,248.47313 1218.85878,245.77 1221.62843,245.77 L1225.23861,245.77 L1225.23861,250.235565 L1221.62843,250.235565 C1221.23243,250.235565 1220.77383,250.714522 1220.77383,251.433739 L1220.77383,253.212609 L1225.23861,253.212609 L1225.23861,257.678174 L1220.77383,257.678174 L1220.77383,267.795739 L1225.536,267.795739 C1227.8807,267.795739 1230,265.678783 1230,263.332522 L1230,245.472609 Z"
                    id="Fill-70"></path>
            </g>
        </g>
    </svg>
);

const shareViaMailSVG = (
    <svg id="mail-share-dialog-icon" className="share-dialog-icon" width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Welcome" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="mail-g" transform="translate(-361.000000, -114.000000)" fill="#FFFFFF">
                <g id="Fill-68-+-Fill-70-+-Path-+-Path" transform="translate(180.000000, 114.000000)">
                    <g id="Path-+-Path" transform="translate(181.000000, 0.000000)">
                        <path d="M40,8.21611407 L40,6.66658201 C40,6.66658201 40,0.0001 33.333518,0.0001 L6.66658201,0.0001 C6.66658201,0.0001 0.0001,0.0001 0.0001,6.66658201 L0.0001,8.21611407 L20.000218,22.04599 L40,8.21611407 Z" id="Path"></path>
                        <path d="M0.0001,14.681681 L0.0001,33.333182 C0.0001,33.333182 0.0001,40 6.66658201,40 L33.333518,40 C33.333518,40 40,40 40,33.333182 L40,14.681681 L20.000218,28.511893 L0.0001,14.681681 Z" id="Path"></path>
                    </g>
                </g>
            </g>
        </g>
    </svg>
);


function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        // var msg = successful ? 'successful' : 'unsuccessful';
        // console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text);
}