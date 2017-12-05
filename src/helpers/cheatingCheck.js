let averageTime = null;
let lastCharTypedTimestamp = null;
const THRESHOLD = 100; // 30ms

const cheatingDetector = function detectIfUserIsCheating(char, punishmentText) {
    /* console.log('----------------');
    console.log(averageTime); */

    const nowTime = Date.now();

    if (!lastCharTypedTimestamp) {
        lastCharTypedTimestamp = nowTime;
        return;
    }

    if (lastCharTypedTimestamp) {
        let timeBetweenCharEntry = nowTime - lastCharTypedTimestamp;

        //console.log(`avg: ${averageTime}`);

        if (timeBetweenCharEntry < THRESHOLD) {
            console.log('TOO FAST');
            return true;
        }
        averageTime = averageTime ? (averageTime + timeBetweenCharEntry) / 2 : timeBetweenCharEntry;
    }
    /* console.log(averageTime); */

    lastCharTypedTimestamp = nowTime;

    return false;
}


export default cheatingDetector;