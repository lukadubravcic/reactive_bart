export function getElementById(arr, id) {

    for (let i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].id === id) return arr[i];
    }
    return null;
}