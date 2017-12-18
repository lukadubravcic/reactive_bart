let averageTime = null;
let lastCharTypedTimestamp = null;
const THRESHOLD = 5; // 30ms

const cheatingDetector = function detectIfUserIsCheating(char, punishmentText) {

    const nowTime = Date.now();

    if (!lastCharTypedTimestamp) {
        lastCharTypedTimestamp = nowTime;
        return;
    }

    if (lastCharTypedTimestamp) {
        let timeBetweenCharEntry = nowTime - lastCharTypedTimestamp;

        //console.log(`avg: ${averageTime}`);

        if (timeBetweenCharEntry < THRESHOLD) {
            return true;
        }
        averageTime = averageTime ? (averageTime + timeBetweenCharEntry) / 2 : timeBetweenCharEntry;
    }

    lastCharTypedTimestamp = nowTime;

    return false;
}


export default cheatingDetector;