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

    if ((createdPlus30Days - Date.now() < 0) && (punishment.accepted === null)) return true; // IGNORED

    return false; // NOT IGNORED
}

export function getPunishmentIdFromURL() {

    if (!window.location.search.length) return null; // prazan string

    const queryParamString = window.location.search.split('?')[1];

    if (!queryParamString) return null; // ne sadrzi ? char

    if (queryParamString.split('=')[0] !== 'id' || !queryParamString.split('=')[1].length) return null; // bez = chara ili drugi parametar (id string) je prazan

    return queryParamString.split('=')[1];
}

export function getUserIDfromURL() {

    if (!window.location.search.length) return null;

    const queryParamString = window.location.search.split('?')[1];

    if (queryParamString.split('=')[0] !== 'uid' || !queryParamString.split('=')[1].length) return null;

    return queryParamString.split('=')[1];
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