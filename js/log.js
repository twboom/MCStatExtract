const lines = [];
const session = {};
const search = {};


function process(file) {
    if (file === undefined) { return };
    file.text().then(data => {
        for (index in data.split(/\r?\n/)) {

            // Split data
            let line = data.split(/\r?\n/)[index];
            if (line === '') { continue };

            // Create lines
            line = new Line(line, parseInt(index) + 1)
            lines.push(line);

            // Add line initiator and types to sets
            session.inits.add(line.initiator)
            session.types.add(line.type)
        };


        // Initialise search
        // Initiators
        const initiators = [...session.inits];
        for (let i = 0; i < initiators.length; i++) {
            if (initiators[i] === undefined) { continue };
            const option = document.createElement('option');
            option.value = initiators[i];
            option.innerText = initiators[i].charAt(0).toUpperCase() + initiators[i].slice(1);
            document.getElementById('inits').appendChild(option)
        };

        // Types
        const types = [...session.types]
        for (let i = 0; i < types.length; i++) {
            if (types[i] === undefined) { continue };
            const option = document.createElement('option');
            option.value = types[i];
            option.innerText = types[i]
            document.getElementById('types').appendChild(option)
        };

        output();

    });
};


function output() {

    document.getElementById('output').innerHTML = '';

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i]

        if (search.type !== 'all' && line.type !== search.type) {
            console.log(5)
            continue;
        };

        if (search.initiator !== 'all' && line.initiator !== search.initiator) {
            continue;
        };

        if (search.contains !== '' && !line.content.toLowerCase().includes(search.contains)) {
            continue;
        };

        if (search.user !== undefined) {
            
            if (!(line.content.toLowerCase().includes(search.user.name.toLowerCase()) ||
                line.content.toLowerCase().includes(search.user.id) ||
                line.content.toLowerCase().includes(search.user.raw))
            ) { continue }

        };

        printLine(line);

    };

};


function printLine(line) {
    // Container
    const p = document.createElement('p');
    p.classList = 'line';

    // Index
    const index = document.createElement('span');
    index.classList = 'line index'
    index.innerText = line.index;

    // Red index on custom (weird) line
    if (line.custom) {
        index.dataset.custom = true;
    };
    
    p.appendChild(index);

    p.innerHTML += ' ';

    // In case of something like an exception
    if (!line.custom) {
        // Time
        const time = document.createElement('span');
        time.classList = 'line time';
        time.innerText = `[${line.time}]`;
        p.appendChild(time)

        // Initiator
        const initiator = document.createElement('span');
        initiator.classList = 'line init';
        initiator.dataset.type = line.type;
        initiator.innerText = `[${line.initiator}/${line.type}]`;
        p.appendChild(initiator);

        p.innerHTML += ': ';
    };

    // Content
    const content = document.createElement('span');
    content.classList = 'line content';
    content.innerText = line.content;
    p.appendChild(content);

    // Add to output element
    document.getElementById('output').appendChild(p)
};


class Line {

    constructor(line, index) {

        this.index = index;
        this.line = line;
        
        if (line.charAt(0) == '[') {
            this.time = line.split(' ')[0].replace('[', '').replace(']', '');
            this.initiator = line.split('[')[2].split(']')[0].split('/')[0];
            this.type = line.split('[')[2].split(']')[0].split('/')[1];
            this.content = line.split(']')[2].substring(2);
            for (let i = 3; i < line.split(']').length; i++) {
                this.content += ']';
                this.content += line.split(']')[i];
            };
            this.custom = false;
        } else {
            this.content = line;
            this.custom = true;
        };

    };

};


function init() {

    // Home button
    document.getElementById('header-text').addEventListener('click', _ => {
        location.href = '/'
    })

    // Upload files
    document.getElementById('upload').addEventListener('change', _ => {
        const files = document.getElementById('upload').files;
        process(files[0])
    });


    // Initialize search
    search.initiator = document.getElementById('inits').value;
    search.type = document.getElementById('types').value;
    search.contains = document.getElementById('contains').value;

    document.getElementById('inits').addEventListener('input', _ => {
        search.initiator = document.getElementById('inits').value;
        output();
    })

    document.getElementById('types').addEventListener('input', _ => {
        search.type = document.getElementById('types').value;
        output();
    })

    document.getElementById('contains').addEventListener('input', _ => {
        search.contains = document.getElementById('contains').value.toLowerCase();
        output();
    })

    document.getElementById('search').addEventListener('click', _ => {
        search.user = {}
        search.user.name = document.getElementById('user').value;
        if (search.user.name === '') {
            search.user = undefined;
            output();
            return;
        }
        fetch(`https://playerdb.co/api/player/minecraft/${search.user.name}`)
            .then(
                r => r.json()
            ).then(
                json => {
                    search.user.uuid = json.data.player.id;
                    search.user.raw = json.data.player.raw_id;
                }
            );
        output();
    })


    // Display options

    session.display = { // Default values
        'index': true,
        'time': true,
        'init': true,
        'content': true,
    }

    document.getElementById('show-index').addEventListener('input', _ => {
        const status = document.getElementById('show-index').checked;
        session.display.index = status;
        output();
    })

    document.getElementById('show-time').addEventListener('input', _ => {
        const status = document.getElementById('show-time').checked;
        session.display.time = status;
        output();
    })

    document.getElementById('show-init').addEventListener('input', _ => {
        const status = document.getElementById('show-init').checked;
        session.display.init = status;
        output();
    })

    document.getElementById('show-content').addEventListener('input', _ => {
        const status = document.getElementById('show-content').checked;
        session.display.content = status;
        output();
    })


    // Creating sets
    session.inits = new Set();
    session.types = new Set();
    
}


window.onload = init