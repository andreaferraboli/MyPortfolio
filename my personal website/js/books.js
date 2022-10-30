//functions
function addFilter(map, param) {
    map.has(param)
        ? map.set(param, map.get(param) + 1)
        : map.set(param, 1);
}

function showBooks(arrayBooks) {
    arrayBooks.forEach((book) => {
        let div_book = `
    <div class="card">
      <div class="photo">
      <img src="${book.copertina}">
      </div>
      <div class="description">
        <div class="center h-30">
            <h2>${book.titolo}</h2>
        </div>
        <div class="left h-10">
            <h1><span class="span">Autore:</span> ${book.autore}</h1>
        </div>
        <div class="left h-10">
            <h1><span class="span">Anno: </span>${book.anno}</h1>
        </div>
        <div class="left h-10">
            <h1><span class="span">Numero pagine: </span>${book.pagine}</h1>
        </div>
        <div class="left h-10">
            <h1><span class="span">Categoria: </span>${book.categoria}</h1>
        </div>
        <div class="left h-10">
            <h1><span class="span">Lingua: </span>${book.lingua}</h1>
        </div>
        
        <div class="center h-20" style="justify-content: space-evenly !important;">
        <a target="_blank" class="link" href="${book.link}">Scopri di più!</a>
        <a target="_blank" class="amazon" href="${book.amazon}">Compra</a>
        </div>
      </div>
    </div>
    `;
        let section = document.getElementById("section-books");
        section.innerHTML += div_book;

    });
}

function createFilter(arrayBooks, categories, authors, languages) {
    arrayBooks.forEach((book) => {
        addFilter(categories, book.categoria);
        addFilter(authors, book.autore);
        addFilter(languages, book.lingua);
    });
}

function showFilter(filterList, idFilter) {
    for (let [key, value] of filterList) {
        let id = "input_" + idFilter + "_" + key.replace(/ /g, "_");
        document.getElementById(idFilter + "Dropdown").innerHTML += `
    <div class="container center">
      <div class="input_box center">
          <input id="${id}" class="input_user" type="checkbox">
      </div>
      <div class="input_text center">
        <label>${key}</label>
      </div>
      <div class="input_info center">
        <label>(${value})</label>
      </div>
    </div>
    `;
    }
}

function queryBooks(categoriesInput, authorsInput, languagesInput, library) {
    let outputBooks = [];
    library.forEach((book) => {
        if (categoriesInput.includes(book.categoria) || authorsInput.includes(book.autore) || languagesInput.includes(book.lingua))
            outputBooks.push(book)
    })
    return outputBooks;
}

function showResults(id) {
    document.getElementById(id).classList.toggle("show");
    let arrow_id = id.replace("Dropdown", "") + "-arrow";
    document.getElementById(arrow_id).classList.toggle("bx-chevron-down");
    document.getElementById(arrow_id).classList.toggle("bx-chevron-up");
}


function filterResults(library) {
    let section = document.getElementById("section-books");
    section.innerHTML = '';
    let inputs = document.querySelectorAll('.input_user');
    let selectedInputs = [];
    inputs.forEach((input) => {
        if (input.checked === true)
            selectedInputs.push(input.id);

    });
    let categoriesInput = [], authorsInput = [], languagesInput = [];
    if (selectedInputs.length === 0)
        showBooks(library)
    else {
        selectedInputs.forEach((input) => {
            if (input.includes("categories"))
                categoriesInput.push(input.replace("input_categories_", "").replace("_", " "))
            else if (input.includes("authors"))
                authorsInput.push(input.replace("input_authors_", "").replace("_", " "))
            else
                languagesInput.push(input.replace("input_languages_", "").replace("_", " "))
        })
        let booksFiltered = queryBooks(categoriesInput, authorsInput, languagesInput, library);
        showBooks(booksFiltered);
    }

}

function discardFilter() {
    let inputs = document.querySelectorAll('.input_user');
    inputs.forEach((input) => {
        input.checked = false;
    });
}

// console.log(somma);
{
    /* <div class="center h-40">
              <p>${book.descrizione}</p>
          </div> */
}
