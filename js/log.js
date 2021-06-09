const lines = [];

function process(file) {
    if (file === undefined) { return };
    file.text().then(data => {
        for (index in data.split(/\r?\n/)) {
            let line = data.split(/\r?\n/)[index];
            if (line === '') { continue };
            line = new Line(line)
            console.log(line)
            lines.push(line)
        }
    })
}


class Line {

    constructor(line) {

        this.line = line;
        this.time = line.split(' ')[0].replace('[', '').replace(']', '')
        this.initiator = line.split('[')[2].split(']')[0].split('/')[0]
        this.type = line.split('[')[2].split(']')[0].split('/')[1]
        this.content = line.split(']')[2].substring(2)
        for (let i = 2; i < line.split(']').length; i++) {
            this.content += ']'
            this.content += line.split(']')[i]
        }

    }

}


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

}

window.onload = init