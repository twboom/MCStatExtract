const players = [];
const searchables = {};

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
                    updatePlayerList()
                }
            );
    };
};

function autoComplete() {
    
    let query = document.getElementById('query').value;
    const cat = document.getElementById('cat').value;

    if (searchables[cat] === undefined) { return };

    // if (query === '') { displayAutocomplete([], true); return };
    if (query === '') { query = 'minecraft:'}

    query = query.replaceAll(' ', '_')
    query = query.replaceAll('minecraft:', '')
    query = 'minecraft:' + query;

    const options = [...searchables[cat]]
    
    let matches = options.filter(option => option.includes(query));

    displayAutocomplete(matches);
    
}

function updatePlayerList() {
    const playerlist = document.getElementById('players');
    playerlist.innerHTML = '';
    players.forEach(player => {
        const el = document.createElement('li');
        const name = document.createElement('b');
        name.innerText = player.name;
        const uuid = document.createElement('i');
        uuid.innerText = player.uuid
        el.appendChild(name);
        el.innerHTML += ' - ';
        el.appendChild(uuid);
        el.addEventListener('click', _ => {
            console.log(player.stats)
        })
        playerlist.appendChild(el);
    });
};

function displayAutocomplete(elements, makeEmpty) {

    const parent = document.getElementById('autocomplete');
    parent.innerHTML = '<summary>Suggestions</summary>';

    if (makeEmpty) { return };

    elements.forEach(element => {
        const el = document.createElement('button');
        el.innerText = element;
        el.classList.add('autocomplete-element');
        el.addEventListener('click', _ => {
            document.getElementById('query').value = element;
            document.getElementById('search').click();
            parent.innerHTML = '';
        });
        parent.appendChild(el);
    });
}

function search() {
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

        updatePlayerList();
        autoComplete();
    });
};

function main() {
    document.getElementById('upload').addEventListener('change', _ => {
        const files = document.getElementById('upload').files;
        for (let i = 0; i < files.length; i++) {
            process(files[i]);
        };
    });
    document.getElementById('search').addEventListener('click', search);
    document.getElementById('query').addEventListener('input', autoComplete);
    document.getElementById('cat').addEventListener('input', autoComplete);
};

main()