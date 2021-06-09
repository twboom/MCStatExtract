const lines = [];
const session = {};

function process(file) {
    if (file === undefined) { return };
    file.text().then(data => {
        for (index in data.split(/\r?\n/)) {
            let line = data.split(/\r?\n/)[index];
            if (line === '') { continue };
            line = new Line(line, parseInt(index) + 1)
            lines.push(line);
            session.inits.add(line.initiator)
            session.types.add(line.type)
            printLine(line);
        };

    });
};

function search() {

}

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

    // Creating sets
    session.inits = new Set();
    session.types = new Set();
    
}

window.onload = init