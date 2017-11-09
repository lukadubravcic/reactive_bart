export function getElementById(arr, id) { //provided array of punishments and needed punishment id, returns first element where arr[i].id === id

    for (let i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].id === id) return arr[i];
    }
    return null;
}

export function dateToHumanReadable(date) {
    
}