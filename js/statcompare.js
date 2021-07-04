const players = [];
const searchables = {};

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
    query = query.replaceAll(' ', '_')
    query = query.replaceAll('minecraft:', '')
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


function autoComplete(evt) {
    let query = evt.target.value
    const cat = document.getElementById('cat').value;

    if (query === '') { return };

    query = query.replaceAll(' ', '_')
    query = query.replaceAll('minecraft:', '')
    query = 'minecraft:' + query;

    const matches = searchables[cat]
    
}


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

        // Add to searchables
        for (const [key, value] of Object.entries(pl.stats)) {
            if (searchables[key] === undefined) {
                searchables[key] = new Set();
            };

            const obj = value

            for (const [prop, count] of Object.entries(obj)) {
                searchables[key].add(prop)
            }
        }

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
    document.getElementById('query').addEventListener('input', autoComplete)
    document.getElementById('header-text').addEventListener('click', _ => {
        location.href = '/'
    })
};

window.onload = init;