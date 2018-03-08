export function getElementById(arr, id) { //provided array of punishments and needed punishment id, returns first element where arr[i].id === id

    for (let i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].id === id) return arr[i];
    }
    return null;
}

export function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

export function checkIfIgnoredPunishment(punishment) {

    if (typeof punishment.ignored !== 'undefined' && punishment.ignored !== null) return true;

    let createdPlus30Days = (new Date(punishment.created).getTime()) + (30 * 24 * 60 * 60 * 1000);

    if ((createdPlus30Days - Date.now() < 0)) return true; // IGNORED

    return false; // NOT IGNORED
}

export function getQueryStringData() {
    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query = window.location.search.substring(1);

    let urlParams = {};

    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);

    return urlParams;
}

export function getPunishmentStatus(punishment) {

    let punishmentStatus = 'UNKNOWN';

    const acceptedTimeDefined = typeof punishment.accepted !== 'undefined' && punishment.accepted !== null;
    const givenUpTimeDefined = typeof punishment.given_up !== 'undefined' && punishment.given_up !== null;
    const deadlinePassed = typeof punishment.deadline !== 'undefined' && punishment.deadline !== null && hasPunishmentDeadlinePassed(punishment.deadline);
    const failedTimeDefined = typeof punishment.failed !== 'undefined' && punishment.failed !== null;
    const doneTimeDefined = typeof punishment.done !== 'undefined' && punishment.done !== null;
    const punishmentIgnored = checkIfIgnoredPunishment(punishment);
    const rejectedTimeDefined = typeof punishment.rejected !== 'undefined' && punishment.rejected !== null;
    const waitingForAccept = !punishmentIgnored && !deadlinePassed;

    if (acceptedTimeDefined) {
        // ako je kazna acceptana, moze biti inprogress (accepted), givenup, done, failed
        if (givenUpTimeDefined) {
            punishmentStatus = 'GIVEN UP';
        } else if (failedTimeDefined || (deadlinePassed && !doneTimeDefined)) {
            punishmentStatus = 'FAILED';
        } else if (doneTimeDefined) {
            punishmentStatus = 'DONE';
        } else {
            punishmentStatus = 'ACCEPTED';
        }
    } else {
        // ignored, rejected, pending, failed (nije acceptano, deadline je prosao)
        if (punishmentIgnored) {
            punishmentStatus = 'IGNORED';
        } else if (rejectedTimeDefined) {
            punishmentStatus = 'REJECTED';
        } else if (waitingForAccept) {
            punishmentStatus = 'PENDING';
        } else if (deadlinePassed) {
            punishmentStatus = 'FAILED';
        }
    }

    return punishmentStatus;
}

export function hasPunishmentDeadlinePassed(deadline) {
    return (Date.now() > new Date(deadline).getTime());
}

export function trimExcessSpaces(whatToWrite) {

    let trimmed = whatToWrite.replace(/\s+/g, ' ').trim();

    return trimmed;
}