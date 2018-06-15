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

function renderTableRow() {
    //
}

function renderTableBody() {
    locations.forEach(loca => {
        renderTableRow(loca);
    });
    //
}

function onDomReady() {
    getLocations().then(json => {
        locations = json;
        console.log(json);
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

    document
        .querySelectorAll('table input[type="checkbox"]')
        .forEach(function(checkbox) {
            checkbox.addEventListener('input', checkDeleteButton);
        });

    // document.querySelector('thead input').addEventListener('input', function() {
    //     const tbodyCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    //     const thisCheckboxValue = this.checked;
    //     tbodyCheckboxes.forEach(checkbox => {
    //         checkbox.checked = thisCheckboxValue;
    //     });
    // });
}

document.addEventListener('DOMContentLoaded', onDomReady);
