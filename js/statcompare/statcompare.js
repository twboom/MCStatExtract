import { autoComplete } from "./autocomplete.js";
import { process } from "./import.js";
import { search } from "./search.js";

export const players = [];
export const searchables = {};

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
    document.getElementById('header-text').addEventListener('click', _ => {
        location.href = '/'
    })
};

main()