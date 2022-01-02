import { autoComplete } from "./autocomplete.js";
import { updatePlayerList } from "./display.js";
import { Player } from "./Player.js";
import { players, searchables } from "./statcompare.js";


export function process(file) {
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