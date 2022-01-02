import { players } from "./statcompare.js";


export function search() {
    document.getElementById('results').innerHTML = '';
    let query = document.getElementById('query').value;
    const cat = document.getElementById('cat').value;
    if (query === '' || players.length === 0) { return }
    query = query.replaceAll(' ', '_')
    query = query.replaceAll('minecraft:', '')
    query = 'minecraft:' + query;
    players.forEach(player => {
        const ct = player.stats[cat];
        if (ct === undefined) { return };
        let result = ct[query];
        if (result === undefined) { result = 0 };
        const tr = document.createElement('tr');
        const count = document.createElement('td');
        count.innerText = result;
        const name = document.createElement('td');
        name.innerText = player.name;
        tr.appendChild(count);
        tr.appendChild(name);
        document.getElementById('results').appendChild(tr);
    })
};