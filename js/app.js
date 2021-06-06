const players = [];

function update() {
    const playerlist = document.getElementById('players');
    playerlist.innerHTML = '';
    for (player in players) {
        const el = document.createElement('li');
        const name = document.createElement('b');
        name.innerText = players[player].name;
        const uuid = document.createElement('i');
        uuid.innerText = players[player].uuid
        el.appendChild(name);
        el.innerHTML += ' - ';
        el.appendChild(uuid);
        playerlist.appendChild(el);
    };
};

function search() {
    document.getElementById('results').innerHTML = '';
    let query = document.getElementById('query').value;
    const cat = document.getElementById('cat').value;
    if (query === '' || players.length === 0) { return }
    query = 'minecraft:' + query;
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const ct = player.stats[cat];
        if (ct === undefined) { continue };
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
    };
};

class Player {
    constructor(stats, uuid) {
        this.stats = stats.stats;
        this.uuid = uuid;
        this.dataVersion = stats.DataVersion;

        fetch(`https://playerdb.co/api/player/minecraft/${this.uuid}`).then(
            r => r.json()
            ).then(
                json => {
                    this.info = json;
                    this.name = json.data.player.username;
                    update()
                }
            );
    };
};

function process(file) {
    if (file === undefined) { return }
    const uuid = file.name.replace('.json', '')
    file.text().then(r => JSON.parse(r)).then(json => {
        const pl = new Player(json, uuid);
        if (players.includes(pl)) { return };
        players.push(pl);
        update();
    });
};

function init() {
    document.getElementById('upload').addEventListener('change', _ => {
        const files = document.getElementById('upload').files;
        for (let i = 0; i < files.length; i++) {
            process(files[i]);
        };
    });
    document.getElementById('search').addEventListener('click', search);
};

window.onload = init;