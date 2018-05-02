let averageTime = null;
let lastCharTypedTimestamp = null;
const THRESHOLD = 10; // 10ms

class cheatingDetector {

    constructor() {
        this.startingTimeout = null;
        this.lastCharTypedTimestamp = null;
        this.averageTime = null;
        this.BEST_AVERAGE = 40; // 40ms
        this.IGNORED_TIME_ON_START = 2000; // 2s 
    }

    start() {
        this.clearData();
        this.startingTimeout = setTimeout(() => {
            clearTimeout(this.startingTimeout);
            this.startingTimeout = null;
        }, this.IGNORED_TIME_ON_START);
    }

    stop() {
        this.lastCharTypedTimestamp = null;
    }

    onKeyPress() {
        this.addToAverage();    
        if (!this.startingTimeout) {
            if (this.averageTime < this.BEST_AVERAGE) return true;
        }
    }

    addToAverage() {
        let timeBetweenCharEntry = null;
        let nowTime = Date.now();

        if (this.lastCharTypedTimestamp !== null) {
            timeBetweenCharEntry = nowTime - this.lastCharTypedTimestamp
        } else {
            this.lastCharTypedTimestamp = nowTime;
            return false;
        }

        this.lastCharTypedTimestamp = nowTime;

        if (this.averageTime === null && timeBetweenCharEntry !== null) {
            this.averageTime = timeBetweenCharEntry;
        } else if (this.averageTime !== null) {
            this.averageTime = (this.averageTime + timeBetweenCharEntry) / 2;
        }

        return;
    }

    clearData() {
        this.averageTime = null;
        this.lastCharTypedTimestamp = null;
        clearTimeout(this.startingTimeout);
    }
}

export default cheatingDetector;