import { displayAutocomplete } from "./display.js";
import { searchables } from "./statcompare.js";

export function autoComplete() {
    
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