function makeRelocateButton(buttonId, pageUrl) {
    document.getElementById(buttonId).addEventListener('click', () => {
        document.location.href = pageUrl
    })
}

function pageRedict(pageUrl) {
        document.location.href = '/html/' + pageUrl + ".html"
}