'use strict';

let baseLocations;
let sortingField;
let sortingOrder = 'asc';

class Location {
    constructor(country, city) {
        this.country = country;
        this.city = city;
        this.selected = false;
    }

    setSelected(value) {
        this.selected = value;
    }
}

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
    row.setAttribute('data-id', location.id);
    // debugger;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
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
            baseLocations = json;
            let id = 0;
            baseLocations.forEach(loca => {
                loca.id = id++;
            });
            renderTableBody(baseLocations);
        })
        .then(() => {
            document
                .querySelectorAll('table input[type="checkbox"]')
                .forEach(function(checkbox) {
                    checkbox.addEventListener('input', checkDeleteButton);
                });
        });

    function sortlocations(a, b) {
        let result;
        if (sortingOrder === 'asc') {
            result = 1;
        } else if (sortingOrder === 'desc') {
            result = -1;
        } else {
            throw new Error('Unsupported sorting order');
        }
        if (a[sortingField] > b[sortingField]) {
            return result;
        }
        if (a[sortingField] < b[sortingField]) {
            return -result;
        }
        return 0;
    }
    function getSortedLocations(sortingType) {
        switch (sortingType) {
            case 'no-sorting':
                return baseLocations;
            case 'country-asc':
                sortingField = 'country';
                sortingOrder = 'asc';
                break;
            case 'country-desc':
                sortingField = 'country';
                sortingOrder = 'desc';
                break;
            case 'city-asc':
                sortingField = 'city';
                sortingOrder = 'asc';
                break;
            case 'city-desc':
                sortingField = 'city';
                sortingOrder = 'desc';
                break;
            default:
                throw new Error('Unsupported sorting type');
            }
        return baseLocations.slice().sort(sortlocations);
    }

    sorting.addEventListener('change', e => {
        const sortingType = e.target.value;
        const sortedLocations = getSortedLocations(sortingType);
        renderTableBody(sortedLocations);
    });

    search.addEventListener('keyup', tableSearch);
}

document.addEventListener('DOMContentLoaded', onDomReady);
