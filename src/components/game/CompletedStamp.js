import React from 'react';

const CompletedStamp = props => {

    let stringToShare = `I've just written ${props.punishment.how_many_times}x "${props.punishment.what_to_write.trim()}" on Skolded.com! I rock! #Skolded`;

    const handleTwitterClick = ev => {
        ev.preventDefault(); 

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

        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(stringToShare)}`, 'targetWindow', opts);
    }

    const handleFbClick = ev => {
        ev.preventDefault();

        window.FB.ui({
            method: 'share',
            href: 'https://www.skolded.com',
            quote: stringToShare,
            hashtag: '#skolded',
        }, function (response) { });
    }

    return (
        <div className="board-stamps-container board-stamps-completed-container">

            <img id="board-failed-stamp-img" src="board-completed-stamp.png" alt="" />

            <div className="board-social-completed-stamp-container">
                <img id="board-failed-social-stamp-img" src="board-completed-social.png" alt="" />
                <label className="board-social-share-label">SHARE</label>

                <div className="social-btns-container">
                    <a className="twitter-share-button"
                        onClick={handleTwitterClick}>
                        <button id="twitter-btn" className="social-btn">
                            <svg width="41px" height="34px" viewBox="0 0 41 34" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="page-02a" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-571.000000, -1090.000000)">
                                    <g id="Group-Copy-3" transform="translate(535.000000, 1008.000000)" fill="#FFFFFF">
                                        <g id="Group-72" transform="translate(35.000000, 82.000000)">
                                            <path d="M37.5925,10.0105 C37.5925,9.6485 37.5855,9.2875 37.5695,8.9295 C39.2015,7.7495 40.6205,6.2765 41.7395,4.5995 C40.2415,5.2665 38.6295,5.7145 36.9385,5.9165 C38.6645,4.8805 39.9895,3.2435 40.6145,1.2925 C38.9995,2.2495 37.2105,2.9455 35.3055,3.3215 C33.7805,1.6965 31.6085,0.6805 29.2035,0.6805 C24.5865,0.6805 20.8425,4.4245 20.8425,9.0395 C20.8425,9.6955 20.9155,10.3335 21.0585,10.9455 C14.1105,10.5965 7.9485,7.2695 3.8255,2.2105 C3.1075,3.4455 2.6935,4.8805 2.6935,6.4135 C2.6935,9.3135 4.1705,11.8735 6.4145,13.3725 C5.0425,13.3295 3.7545,12.9525 2.6275,12.3265 C2.6265,12.3615 2.6265,12.3955 2.6265,12.4335 C2.6265,16.4815 5.5085,19.8625 9.3335,20.6285 C8.6315,20.8205 7.8915,20.9235 7.1295,20.9235 C6.5915,20.9235 6.0665,20.8695 5.5575,20.7715 C6.6225,24.0935 9.7085,26.5115 13.3675,26.5785 C10.5065,28.8215 6.9015,30.1575 2.9845,30.1575 C2.3095,30.1575 1.6445,30.1195 0.9895,30.0415 C4.6895,32.4135 9.0835,33.7975 13.8055,33.7975 C29.1835,33.7975 37.5925,21.0575 37.5925,10.0105 Z"
                                                id="Fill-68"></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </button>
                    </a>

                    <a onClick={handleFbClick}>
                        <button id="facebook-btn" className="social-btn">
                            <svg width="35px" height="35px" viewBox="0 0 35 35" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                <g id="page-02a" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-627.000000, -1090.000000)">
                                    <g id="Group-Copy-3" transform="translate(535.000000, 1008.000000)" fill="#FFFFFF">
                                        <g id="Group-72" transform="translate(35.000000, 82.000000)">
                                            <path d="M91.4545,5.8295 C91.4545,2.8335 88.7465,0.1235 85.7505,0.1235 L62.9305,0.1235 C59.9325,0.1235 57.2245,2.8335 57.2245,5.8295 L57.2245,28.6505 C57.2245,31.6485 59.9325,34.3535 62.9305,34.3535 L74.3395,34.3535 L74.3395,21.4255 L70.1565,21.4255 L70.1565,15.7195 L74.3395,15.7195 L74.3395,13.4945 C74.3395,9.6635 77.2185,6.2095 80.7575,6.2095 L85.3705,6.2095 L85.3705,11.9155 L80.7575,11.9155 C80.2515,11.9155 79.6655,12.5275 79.6655,13.4465 L79.6655,15.7195 L85.3705,15.7195 L85.3705,21.4255 L79.6655,21.4255 L79.6655,34.3535 L85.7505,34.3535 C88.7465,34.3535 91.4545,31.6485 91.4545,28.6505 L91.4545,5.8295 Z"
                                                id="Fill-70"></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </button>
                    </a>

                </div>
            </div>

        </div>
    )
}

export default CompletedStamp;