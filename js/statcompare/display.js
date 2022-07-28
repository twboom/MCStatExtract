import { players, searchables } from "./statcompare.js";

export function updatePlayerList() {
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

export function displayAutocomplete(elements, makeEmpty) {

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