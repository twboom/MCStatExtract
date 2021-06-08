function init() {
    document.querySelectorAll('.tool-button').forEach(el => {
        el.addEventListener('click', _ => {
            location.href = el.dataset.link
        })
    })
}

window.onload = init