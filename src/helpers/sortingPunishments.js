export const sortPunishmentsByOrderedBy = (punishments, order) => { // order = 1 / -1 (ASC / DESC)
    let tmpPun = JSON.parse(JSON.stringify(punishments));

    tmpPun.sort((a, b) => {
        return a.user_ordering_punishment == b.user_ordering_punishment
            ? 0 : +(a.user_ordering_punishment > b.user_ordering_punishment) || order;
    });


    console.log('---- BEFORE ----')
    for (let pun of punishments) {
        console.log(pun.user_ordering_punishment)
    }
    console.log('---- AFTER ----')
    for (let pun of tmpPun) {
        console.log(pun.user_ordering_punishment)
    }
}

export const sortPunishmentsByDeadline = (punishments, order) => {
    let tmpPun = JSON.parse(JSON.stringify(punishments));

    tmpPun.sort((a, b) => {
        if (a.deadline === null && order === 1) return 1;
        else if (a.deadline === null && order === -1) return -1;

        let c = new Date(a.deadline).getTime();
        let d = new Date(b.deadline).getTime();

        if (c === d) return 0;
        else if (c > d) return order;
        else if (c < d) return order * -1;
    });


    console.log('---- BEFORE ----')
    for (let pun of punishments) {
        console.log(pun.deadline)
    }
    console.log('---- AFTER ----')
    for (let puna of tmpPun) {
        console.log(puna.deadline)
    }
}


export const sortPunishmentsByHowManyTimes = (punishments, order) => {

    /* if(order !== 1 || order !== -1) {
        console.log('')
        return null;} */

    let tempPun = JSON.parse(JSON.stringify(punishments));

    tempPun.sort((a, b) => {
        return (a.how_many_times - b.how_many_times) * order;
    });


    console.log('---- BEFORE ----')
    for (let pun of punishments) {
        console.log(pun.how_many_times)
    }
    console.log('---- AFTER ----')
    for (let pun of tempPun) {
        console.log(pun.how_many_times)
    }
}

