export const sortPunishmentsByOrderedBy = (punishments, order) => { // order = 1 / -1 (ASC / DESC)
    let tmpPun = JSON.parse(JSON.stringify(punishments));

    tmpPun.sort((a, b) => {
        return a.user_ordering_punishment.localeCompare(b.user_ordering_punishment) * order;
    });

    /* console.log('---- BEFORE ----')
    console.log("order: " + order)
    for (let pun of punishments) {
        console.log(pun.user_ordering_punishment)
    }
    console.log('---- AFTER ----')
    for (let pun of tmpPun) {
        console.log(pun.user_ordering_punishment)
    } */
    return tmpPun;
};

export const sortPunishmentsByDeadline = (punishments, order) => {
    let tmpPun = JSON.parse(JSON.stringify(punishments));

    tmpPun.sort((a, b) => {
        if (a.deadline === null && order === 1) return 1; // ASC order, kazne bez deadline-a idu na kraj
        else if (a.deadline === null && order === -1) return -1; // DESC order, kazne bez deadline-a idu na pocetak

        let c = new Date(a.deadline).getTime();
        let d = new Date(b.deadline).getTime();

        if (c === d) return 0;
        else if (c > d) return order;
        else if (c < d) return order * -1;
    });

    /* console.log('---- BEFORE ----')
    for (let pun of punishments) {
        console.log(pun.deadline)
    }
    console.log('---- AFTER ----')
    for (let puna of tmpPun) {
        console.log(puna.deadline)
    } */
    return tmpPun;
};


export const sortPunishmentsByHowManyTimes = (punishments, order) => {

    /* if(order !== 1 || order !== -1) {
        console.log('')
        return null;} */

    let tmpPun = JSON.parse(JSON.stringify(punishments));

    tmpPun.sort((a, b) => {
        return (a.how_many_times - b.how_many_times) * order;
    });

    /* console.log('---- BEFORE ----')
    for (let pun of punishments) {
        console.log(pun.how_many_times)
    }
    console.log('---- AFTER ----')
    for (let pun of tmpPun) {
        console.log(pun.how_many_times)
    } */
    return tmpPun;
};

