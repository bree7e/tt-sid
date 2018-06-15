'use strict';

let locations;

function getLocations() {
    const url = 'http://localhost:3000/locations';
    return fetch(url).then(response => response.json());
}

function checkDeleteButton() {
    const removeButton = remove;
    const checked = document.querySelectorAll('tbody input:checked');
    if (checked.length > 0) {
        removeButton.removeAttribute('disabled');
    } else {
        removeButton.setAttribute('disabled', '');
    }
}

function tableSearch() {
    const phrase = this.value;
    let table = document.querySelector('#table');
    const regPhrase = new RegExp(phrase, 'i');
    let flag = false;
    for (let i = 1; i < table.rows.length; i++) {
        flag = false;
        for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            table.rows[i].style.display = '';
        } else {
            table.rows[i].style.display = 'none';
        }
    }
}

function renderTableRow(location, tbody) {
    let row = tbody.insertRow();

    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    const checkboxCell = row.insertCell();
    checkboxCell.appendChild(checkbox);
    const countryCell = row.insertCell();
    countryCell.appendChild(document.createTextNode(location.country));
    const cityCell = row.insertCell();
    cityCell.appendChild(document.createTextNode(location.city));
}

function renderTableBody(locations) {
    let tbody = document.querySelector('#table tbody');
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    locations.forEach(loca => {
        renderTableRow(loca, tbody);
    });
}

function onDomReady() {
    getLocations()
        .then(json => {
            locations = json;
            renderTableBody(locations);
        })
        .then(() => {
            document
                .querySelectorAll('table input[type="checkbox"]')
                .forEach(function(checkbox) {
                    checkbox.addEventListener('input', checkDeleteButton);
                });
        });

    sorting.addEventListener('change', e => {
        const sortingType = e.target.value;
        switch (sortingType) {
            case 'no-sorting':
            // break;
            case 'country-asc':
            // break;
            case 'country-desc':
            // break;
            case 'city-asc':
            // break;
            case 'city-desc':
                console.log(sortingType);
                break;
            default:
                throw new Error('Unsupported sorting type');
        }
    });

    search.addEventListener('keyup', tableSearch);

}

document.addEventListener('DOMContentLoaded', onDomReady);
