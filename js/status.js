// Fetch the status from Mojangs API
// API: https://status.mojang.com/check
let status = [];
function getStatus() {

    fetch('https://status.mojang.com/check')
        .then(r => r.json())
        .then(data => process(data))
        .then()

};

// Process / Display the status data
function process(status) {

    const container = document.getElementById('output');
    
    for (let site in status) {
        const obj = status[site]
        const el = document.createElement('p');
        el.classList = 'status';
        el.innerText = Object.keys(obj)[0];
        el.style.color = obj[Object.keys(obj)[0]];
        container.appendChild(el)
    }

}


function init() {
    getStatus()

    document.querySelectorAll('.tool-button').forEach(el => {
        el.addEventListener('click', _ => {
            location.href = el.dataset.link
        })
    })
}

window.onload = init