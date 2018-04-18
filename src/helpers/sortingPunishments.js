import { getPunishmentStatus } from './helpers';

export const sortPunishmentsByString = (punishments, order, field) => { // order = 1 / -1 (ASC / DESC)
    let tmpPun = JSON.parse(JSON.stringify(punishments));

    tmpPun.sort((a, b) => {
        if (a[field]) return a[field].localeCompare(b[field]) * order;
        else return order;
    });

    return tmpPun;
};

export const sortPunishmentsByDate = (punishments, order, field) => {
    let tmpPun = JSON.parse(JSON.stringify(punishments));

    tmpPun.sort((a, b) => {
        if (a[field] === null) return 1 * order;
        if (b[field] === null) return -1 * order;

        let c = new Date(a[field]).getTime();
        let d = new Date(b[field]).getTime();

        if (c === d) return 0;
        else if (c > d) return order;
        else if (c < d) return order * -1;
    });

    return tmpPun;
};


export const sortPunishmentsByNumber = (punishments, order, field) => {
    let tmpPun = JSON.parse(JSON.stringify(punishments));

    tmpPun.sort((a, b) => ((a[field] - b[field]) * order));

    return tmpPun;
};


export const sortPunishmentsByStatus = (punishments, order) => {
    if (typeof punishments === 'undefined' || punishments === null || punishments.length === 0) return punishments;
    let tmp = [...punishments];

    for (let punishment of tmp) {
        punishment.status = getPunishmentStatus(punishment);
    }
    
    return sortPunishmentsByString(tmp, order, 'status');
};
