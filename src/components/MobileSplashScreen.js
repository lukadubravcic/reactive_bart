import React from 'react';

const releaseYear = 2018;

const MobileSplashScreen = props => {
    const logos = [
        'skolded_1.png',
        'skolded_2.png',
        'skolded_3.png',
        'skolded_4.png',
    ];

    const msgs = [
        `Your mobile device 
is a fine piece of 
equipment, but
Skolded.com
requires a proper
desktop computer
because we say so.`,

        `Hint: desktop`,

        `Get yourself a 
proper desktop
computer. Then
come back.`,

        `Your screen is too
small. Your 
keyboard is 
useless. And your
battery is about to
die. Find something
else.`,
    ]

    const logoToShow = logos[Math.floor(Math.random() * logos.length)];
    const msgToShow = msgs[Math.floor(Math.random() * msgs.length)]

    const cpCalc = () => {
        let currentYear = new Date().getFullYear();

        if (currentYear > releaseYear) return `${releaseYear}-${currentYear}`
        else return releaseYear;
    }

    return (
        <div style={{ background: "#2B5D64" }}>
            <div style={{ background: "#2B5D64", minWidth: 375 + "px" }}>
                <div className="mobile-logo-container">
                    <div style={{ width: 285 + "px", position: "absolute" }}>
                        <img className="mobile-logo-image" src={logoToShow} />
                        <span className="logo-beta-mobile-mark">beta</span>
                        <span className="logo-tm-mobile-mark">TM</span>
                    </div>
                </div>
                <div className="mobile-message-container">
                    <span className="mobile-message">{msgToShow}</span>
                </div>

                <div className="mobile-explanation-container">
                    <span className="mobile-explanation-text">
                        Seriously, Skolded is a desktop web app. Great one, though. And as good as you are with your mobile keyboard, you don't really want to punish yourself by using it for skolding. So, put aside your mobile appendix, sit in a comfortable chair, warm up your fingers, show your desktop PC some love and do it the right way!
                    </span>
                </div>

                <div className="mobile-bottom-container">
                    <div className="mobile-social-icons-container">
                        <a target="_blank" href="https://twitter.com/skolded_com">
                            {twitterIcon}
                        </a>
                        <a target="_blank" href="https://www.facebook.com/skolded">
                            {facebookIcon}
                        </a>
                    </div>
                    <div className="kreativni-mobile-link-container">
                        <a id="kreativni-mobile-link" target="_blank" href="http://www.kreativni.com/">
                            &copy;&nbsp;{cpCalc()}&nbsp;KREATIVNI ODJEL
                    </a>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MobileSplashScreen;


const twitterIcon = (
    <svg id="twitter-mobile-icon" width="59px" height="48px" viewBox="0 0 32 26" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="page-02a" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-1146.000000, -2762.000000)">
            <g id="twitter-g" transform="translate(0.000000, 2520.000000)" fill="white">
                <path d="M1156.08426,268 C1168.11922,268 1174.70017,258.029565 1174.70017,249.384087 C1174.70017,249.100783 1174.6947,248.818261 1174.68217,248.538087 C1175.95939,247.614609 1177.06991,246.461826 1177.94565,245.149391 C1176.7733,245.671391 1175.51174,246.022 1174.18835,246.180087 C1175.53913,245.369304 1176.57609,244.088174 1177.06522,242.561304 C1175.8013,243.310261 1174.40122,243.854957 1172.91035,244.149217 C1171.71687,242.877478 1170.01704,242.082348 1168.13487,242.082348 C1164.52157,242.082348 1161.59148,245.012435 1161.59148,248.624174 C1161.59148,249.137565 1161.64861,249.63687 1161.76052,250.115826 C1156.32296,249.842696 1151.50052,247.238957 1148.27383,243.279739 C1147.71191,244.246261 1147.38791,245.369304 1147.38791,246.569043 C1147.38791,248.838609 1148.54383,250.842087 1150.3,252.015217 C1149.22626,251.981565 1148.21826,251.686522 1147.33626,251.196609 C1147.33548,251.224 1147.33548,251.250609 1147.33548,251.280348 C1147.33548,254.448348 1149.59096,257.094348 1152.58443,257.693826 C1152.03504,257.844087 1151.45591,257.924696 1150.85957,257.924696 C1150.43852,257.924696 1150.02765,257.882435 1149.6293,257.805739 C1150.46278,260.405565 1152.87791,262.297913 1155.74148,262.350348 C1153.50243,264.105739 1150.68113,265.151304 1147.61565,265.151304 C1147.08739,265.151304 1146.56696,265.121565 1146.05435,265.060522 C1148.95,266.91687 1152.38878,268 1156.08426,268"
                    id="Fill-68"></path>
            </g>
        </g>
    </svg>
)

const facebookIcon = (
    < svg id="facebook-mobile-icon" width="48px" height="48px" viewBox="0 0 27 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" >
        <g id="page-02a" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-1203.000000, -2761.000000)">
            <g id="facebook-g" transform="translate(0.000000, 2520.000000)" fill="white">
                <path d="M1230,245.472609 C1230,243.127913 1227.8807,241.007043 1225.536,241.007043 L1207.67687,241.007043 C1205.33061,241.007043 1203.2113,243.127913 1203.2113,245.472609 L1203.2113,263.332522 C1203.2113,265.678783 1205.33061,267.795739 1207.67687,267.795739 L1216.60565,267.795739 L1216.60565,257.678174 L1213.332,257.678174 L1213.332,253.212609 L1216.60565,253.212609 L1216.60565,251.471304 C1216.60565,248.47313 1218.85878,245.77 1221.62843,245.77 L1225.23861,245.77 L1225.23861,250.235565 L1221.62843,250.235565 C1221.23243,250.235565 1220.77383,250.714522 1220.77383,251.433739 L1220.77383,253.212609 L1225.23861,253.212609 L1225.23861,257.678174 L1220.77383,257.678174 L1220.77383,267.795739 L1225.536,267.795739 C1227.8807,267.795739 1230,265.678783 1230,263.332522 L1230,245.472609 Z"
                    id="Fill-70"></path>
            </g>
        </g>
    </svg >
)

