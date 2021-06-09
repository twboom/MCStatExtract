const lines = [];

function process(file) {

}


class Line {

    constructor(time, initiator, content) {

        this.time = time;
        this.initiator = initiator;
        this.content = content;

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
        for (let i = 0; i < files.length; i++) {
            process(files[i]);
        };
    });

}

window.onload = init