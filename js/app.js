const players = [];

function update() {
    const playerlist = document.getElementById('players')
    playerlist.innerHTML = ''
    for (player in players) {
        const el = document.createElement('li')
        el.innerText = players[player].uuid;
        playerlist.appendChild(el)
    };
};

function search() {
    document.getElementById('results').innerHTML = ''
    let query = document.getElementById('query').value;
    const cat = document.getElementById('cat').value;
    if (query === '' || players.length === 0) { return }
    query = 'minecraft:' + query;
    for (let i = 0; i < players.length; i++) {
        const player = players[i]
        const ct = player.stats[cat]
        if (ct === undefined) { continue }
        let result = ct[query]
        if (result === undefined) { result = 0 };
        console.log(`${player.uuid}: ${result}`);
        const tr = document.createElement('tr');
        const count = document.createElement('td');
        count.innerText = result;
        const uuid = document.createElement('td');
        uuid.innerText = player.uuid;
        tr.appendChild(count)
        tr.appendChild(uuid)
        document.getElementById('results').appendChild(tr)
    };
};

class Player {
    constructor(stats, uuid) {
        this.stats = stats.stats;
        this.uuid = uuid;
        this.dataVersion = stats.DataVersion;
    };
};

function process(file) {
    if (file === undefined) { return }
    const uuid = file.name.replace('.json', '')
    file.text().then(r => JSON.parse(r)).then(json => {
        const pl = new Player(json, uuid)
        if (players.includes(pl)) { return }
        players.push(pl)
        update()
    });
};

function init() {
    document.getElementById('upload').addEventListener('change', _ => {
        const files = document.getElementById('upload').files
        //process(document.getElementById('upload').files[0])
        for (let i = 0; i < files.length; i++) {
            process(files[i])
        }
    });
    document.getElementById('search').addEventListener('click', search)
};

window.onload = init;