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
                        <a target="_blank" href="https://skolded.threadless.com/">
                            {shopIcon}
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


const shopIcon = (
    <svg width="54px" height="61px" viewBox="0 0 54 61" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <defs>
            <polygon id="path-1" points="0 60.0560748 53.5034019 60.0560748 53.5034019 0.143327103 0 0.143327103"></polygon>
        </defs>
        <g id="Welcome" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" opacity="0.5">
            <g id="iPhone-6-Copy-3" transform="translate(-259.000000, -502.000000)">
                <g id="Fill-68-+-Fill-70-+-Imported-Layers" transform="translate(63.000000, 502.000000)">
                    <g id="Imported-Layers" transform="translate(196.000000, 0.000000)">
                        <mask id="mask-2" fill="white">
                            <use xlinkHref="#path-1"></use>
                        </mask>
                        <g id="Clip-2"></g>
                        <path d="M49.0684374,16.7377794 L42.5485682,16.7377794 C42.5632037,16.4844336 42.5833907,16.2320972 42.5833907,15.974714 C42.5833907,7.24538692 35.4816336,0.143125234 26.7518019,0.143125234 C18.0224748,0.143125234 10.9202131,7.24538692 10.9202131,15.974714 C10.9202131,16.2320972 10.9398953,16.4844336 10.9545308,16.7377794 L4.43466168,16.7377794 L0.00010093458,60.0558729 L25.3210542,60.0558729 L28.1820449,60.0558729 L53.5035028,60.0558729 L49.0684374,16.7377794 Z M32.1270729,43.0559664 C32.0417832,41.1689944 30.1714654,41.2512561 28.7498019,41.1937234 C25.5340262,41.0635178 22.2213533,41.9133869 19.2165308,39.9643402 C15.9795589,37.8649009 13.961372,34.2539664 15.6727178,30.0868822 C16.8990729,27.100228 18.7774654,24.420415 21.8509234,23.4600224 C23.9357271,22.8084897 26.5120822,22.9588822 28.6645121,23.5256299 C30.5822692,24.0308075 32.2280075,25.5877234 33.9766991,26.7070879 C34.859372,27.2718168 34.8699701,27.3207701 33.5568112,28.9473308 C32.8048486,29.8784523 30.3995776,32.1646206 30.3385121,32.1197047 C28.6927738,30.8978916 26.9940449,30.0505458 24.7669234,30.5309944 C23.0798019,30.8948636 21.4330542,32.7535738 22.3238019,33.7795738 C22.7603439,34.282228 23.8575028,34.3412748 24.6639701,34.3700411 C27.0520822,34.4563402 29.490157,34.1520224 31.8202318,34.5355738 C33.5068486,34.8131439 35.297428,35.6498916 36.6161383,36.7480598 C40.6176897,40.081929 40.8034093,45.2447327 37.0183626,48.9793121 C35.241914,50.7325458 33.1293533,52.312172 30.8886056,53.3825832 C28.5484374,54.5004336 25.8403626,54.4257421 23.4487178,53.1569944 C21.7409047,52.2516112 20.1103065,51.1463776 18.5988112,49.9381907 C16.8995776,48.5806206 17.1216336,47.6363776 19.0045682,46.6033121 C20.2066991,45.9432 21.3624,45.1690318 22.440886,44.321686 C23.7146804,43.3214243 24.2193533,44.4100037 24.7275589,45.1281533 C25.7767738,46.6098729 28.9713533,47.2856299 30.270886,46.023443 C31.105615,45.2129383 32.1709794,44.0274617 32.1270729,43.0559664 L32.1270729,43.0559664 Z M13.5445121,16.7377794 C15.2513159,11.0480972 20.5135402,6.8825271 26.7518019,6.8825271 C32.9895589,6.8825271 38.2522879,11.0480972 39.9585869,16.7377794 L13.5445121,16.7377794 Z M39.9818019,12.0246393 C37.1495776,7.71776075 32.2804935,4.86383551 26.7518019,4.86383551 C21.2226056,4.86383551 16.3535215,7.71776075 13.5212972,12.0251439 C15.2250729,6.32839626 20.5079888,2.16181682 26.7518019,2.16181682 C32.9951103,2.16181682 38.2775215,6.32839626 39.9818019,12.0246393 L39.9818019,12.0246393 Z" id="Fill-1" fill="#FFFFFF" mask="url(#mask-2)"></path>
                    </g>
                </g>
            </g>
        </g>
    </svg>
)
