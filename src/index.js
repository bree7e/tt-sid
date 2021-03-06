'use strict';

let baseLocations;
let sortingField = 'no-sorting';
let sortingOrder = 'asc';
let id = 0;

class Location {
    constructor(country, city) {
        this.country = country;
        this.city = city;
        this.selected = false;
        this.id = id++;
    }
}

function getLocations() {
    const url = 'http://localhost:3000/locations';
    return fetch(url).then(response => response.json());
}

function addLocation() {
    const country = document.querySelector('#modal-country').value;
    const city = document.querySelector('#modal-city').value;
    baseLocations.push(new Location(country, city));
    renderLocations();
}

function deleteLocations() {
    baseLocations = baseLocations.filter(loca => loca.selected === false);
}

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

function renderLocations() {
    const sortingType = sorting.value;
    const sortedLocations = getSortedLocations(sortingType);
    renderTableBody(sortedLocations);
}

function setLocationSelection() {
    const value = this.checked;
    const locationId = Number(this.parentNode.parentNode.dataset.id);
    // debugger;
    baseLocations.find(loca => loca.id === locationId).selected = value;
    renderLocations();
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

function checkDeleteButton() {
    const removeButton = remove;
    const checked = document.querySelectorAll('tbody input:checked');
    if (checked.length > 0) {
        removeButton.removeAttribute('disabled');
    } else {
        removeButton.setAttribute('disabled', '');
    }
}

function renderTableRow(location, tbody) {
    let row = tbody.insertRow();
    row.setAttribute('data-id', location.id);
    // if (location.id == 3) location.selected = true;
    if (location.selected) {
        row.classList.add('selected');
    }
    // debugger;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = location.selected;
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
    document
        .querySelectorAll('table input[type="checkbox"]')
        .forEach(function(checkbox) {
            checkbox.addEventListener('input', checkDeleteButton);
            checkbox.addEventListener('input', setLocationSelection);
        });
}

function openModal() {
    const modal = document.querySelector('#modal');
    document.querySelector('#modal-country').value = '';
    document.querySelector('#modal-city').value = '';
    modal.style.display = 'flex';
}

function closeModal() {
    document.querySelector('#modal').style.display = 'none';
}
function onDomReady() {
    getLocations().then(json => {
        baseLocations = json.map(loca => new Location(loca.country, loca.city));
        renderTableBody(baseLocations);
    });

    sorting.addEventListener('change', e => {
        renderLocations();
    });

    search.addEventListener('keyup', tableSearch);

    add.addEventListener('click', openModal);

    remove.addEventListener('click', () => {
        deleteLocations();
        renderLocations();
    });

    document.querySelector('#modal-ok').addEventListener('click', () => {
        addLocation();
        closeModal();
    });

    document
        .querySelector('#modal-cancel')
        .addEventListener('click', closeModal);
}

document.addEventListener('DOMContentLoaded', onDomReady);
